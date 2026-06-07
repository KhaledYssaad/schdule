import { create } from "zustand";
import { persist as persistMiddleware } from "zustand/middleware";
import { supabase } from "../utils/supabaseClient";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getMonday = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const initialSchedule = () => {
  const schedule = {};
  DAYS.forEach((day) => {
    schedule[day] = [];
  });
  return schedule;
};

export const useScheduleStore = create(
  persistMiddleware(
    (set, get) => ({
      currentUser: null,
      liliaSchedule: initialSchedule(),
      abdellahSchedule: initialSchedule(),
      weekNumber: 1,
      startDate: getMonday(new Date()).toISOString(),
      history: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      // --- Database Operations ---

      fetchInitialData: async () => {
        const { data: tasks, error: tasksError } = await supabase
          .from("tasks")
          .select("*");
        const { data: history, error: historyError } = await supabase
          .from("history")
          .select("*")
          .order("week_number", { ascending: true });

        if (!tasksError && tasks) {
          const lilia = initialSchedule();
          const abdellah = initialSchedule();

          tasks.forEach((task) => {
            const formattedTask = {
              id: task.task_id,
              time: task.time,
              activity: task.activity,
              completed: task.completed,
            };
            if (task.user_name === "Lilia") {
              lilia[task.day].push(formattedTask);
            } else {
              abdellah[task.day].push(formattedTask);
            }
          });

          set({ liliaSchedule: lilia, abdellahSchedule: abdellah });
        }

        if (!historyError && history) {
          set({ history });
          if (history.length > 0) {
            const lastEntry = history[history.length - 1];
            const lastWeek = lastEntry.week_number;
            
            // Calculate current week's start date based on history
            const lastStartDate = new Date(lastEntry.date);
            const currentStartDate = new Date(lastStartDate);
            currentStartDate.setDate(lastStartDate.getDate() + 7);

            set({ 
              weekNumber: lastWeek + 1,
              startDate: currentStartDate.toISOString()
            });
          }
        }
      },

      subscribeToChanges: () => {
        const channel = supabase
          .channel("schema-db-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "tasks" },
            () => {
              get().fetchInitialData();
            },
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      },

      toggleTask: async (user, day, taskId) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        const currentTask = get()[scheduleKey][day].find(t => t.id === taskId);
        
        if (!currentTask) return;

        const newCompleted = !currentTask.completed;

        // Optimistic update
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: state[scheduleKey][day].map((task) =>
              task.id === taskId ? { ...task, completed: newCompleted } : task
            ),
          },
        }));

        // Database update
        await supabase
          .from("tasks")
          .update({ completed: newCompleted })
          .match({ user_name: user, day: day, task_id: taskId });
      },

      updateTask: async (user, day, taskId, updates) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        
        // Optimistic update
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: state[scheduleKey][day].map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          },
        }));

        // Database update
        await supabase
          .from("tasks")
          .update({
            time: updates.time,
            activity: updates.activity,
            completed: updates.completed,
          })
          .match({ user_name: user, day: day, task_id: taskId });
      },

      addTask: async (user, day, task) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        const taskId = Date.now().toString();
        const newTask = { ...task, id: taskId, completed: false };

        // Optimistic update
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: [...state[scheduleKey][day], newTask],
          },
        }));

        // Database insert
        await supabase.from("tasks").insert([
          {
            user_name: user,
            day: day,
            task_id: taskId,
            time: task.time,
            activity: task.activity,
            completed: false,
          },
        ]);
      },

      removeTask: async (user, day, taskId) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";

        // Optimistic update
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: state[scheduleKey][day].filter((task) => task.id !== taskId),
          },
        }));

        // Database delete
        await supabase
          .from("tasks")
          .delete()
          .match({ user_name: user, day: day, task_id: taskId });
      },

      importScheduleFromJSON: async (user, data, selectedDays) => {
        const tasksToInsert = [];
        selectedDays.forEach((day) => {
          if (data[day]) {
            data[day].forEach((task, index) => {
              tasksToInsert.push({
                user_name: user,
                day: day,
                task_id: `${day}-${Date.now()}-${index}`,
                time: task.time || "",
                activity: task.activity || "",
                completed: false,
              });
            });
          }
        });

        if (tasksToInsert.length > 0) {
          await supabase.from("tasks").insert(tasksToInsert);
          get().fetchInitialData();
        }
      },

      getCompletionPercentage: (user, day) => {
        const schedule = user === "Lilia" ? get().liliaSchedule : get().abdellahSchedule;
        const daySchedule = schedule[day] || [];
        if (daySchedule.length === 0) return 0;
        const completed = daySchedule.filter((task) => task.completed).length;
        return Math.round((completed / daySchedule.length) * 100);
      },

      endWeek: async () => {
        const state = get();
        const liliaCompletion = Math.round(
          DAYS.reduce((sum, day) => sum + state.getCompletionPercentage("Lilia", day), 0) / DAYS.length
        );
        const abdellahCompletion = Math.round(
          DAYS.reduce((sum, day) => sum + state.getCompletionPercentage("Abdellah", day), 0) / DAYS.length
        );

        const currentStartDate = new Date(state.startDate);
        const nextStartDate = new Date(currentStartDate);
        nextStartDate.setDate(currentStartDate.getDate() + 7);

        // Save to history in DB
        await supabase.from("history").insert([
          {
            week_number: state.weekNumber,
            lilia_completion: liliaCompletion,
            abdellah_completion: abdellahCompletion,
            date: new Date(state.startDate).toLocaleDateString(),
          },
        ]);

        // Clear tasks for next week in DB
        await supabase.from("tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

        set((prevState) => ({
          weekNumber: prevState.weekNumber + 1,
          startDate: nextStartDate.toISOString(),
          liliaSchedule: initialSchedule(),
          abdellahSchedule: initialSchedule(),
        }));
        
        get().fetchInitialData();
      },

      resetCurrentWeek: async () => {
        await supabase.from("tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        set({
          liliaSchedule: initialSchedule(),
          abdellahSchedule: initialSchedule(),
        });
      },

      checkAndAutoReset: () => {
        const state = get();
        const now = new Date();
        const start = new Date(state.startDate);
        
        if (now.getTime() - start.getTime() > 7 * 24 * 60 * 60 * 1000) {
          state.endWeek();
        }
      },
    }),
    {
      name: "schedule-storage",
      partialize: (state) => ({ 
        currentUser: state.currentUser,
        weekNumber: state.weekNumber,
        startDate: state.startDate
      }),
    }
  )
);
