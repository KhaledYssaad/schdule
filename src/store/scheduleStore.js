import { create } from "zustand";
import { persist as persistMiddleware } from "zustand/middleware";

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
    schedule[day] = [
      {
        id: `${day}-1`,
        time: "08:00 - 09:30",
        activity: "Morning Exercise",
        completed: false,
      },
      {
        id: `${day}-2`,
        time: "09:30 - 11:00",
        activity: "Work Session 1",
        completed: false,
      },
      {
        id: `${day}-3`,
        time: "11:00 - 12:30",
        activity: "Creative Work",
        completed: false,
      },
      {
        id: `${day}-4`,
        time: "12:30 - 14:00",
        activity: "Lunch & Rest",
        completed: false,
      },
      {
        id: `${day}-5`,
        time: "14:00 - 15:30",
        activity: "Work Session 2",
        completed: false,
      },
      {
        id: `${day}-6`,
        time: "15:30 - 17:00",
        activity: "Learning Time",
        completed: false,
      },
      {
        id: `${day}-7`,
        time: "17:00 - 18:30",
        activity: "Personal Project",
        completed: false,
      },
      {
        id: `${day}-8`,
        time: "18:30 - 20:00",
        activity: "Dinner & Family",
        completed: false,
      },
      {
        id: `${day}-9`,
        time: "20:00 - 21:30",
        activity: "Relaxation",
        completed: false,
      },
      {
        id: `${day}-10`,
        time: "21:30 - 23:00",
        activity: "Evening Reading",
        completed: false,
      },
      {
        id: `${day}-11`,
        time: "23:00 - 00:00",
        activity: "Sleep Prep",
        completed: false,
      },
      {
        id: `${day}-12`,
        time: "00:00 - 08:00",
        activity: "Sleep",
        completed: false,
      },
    ];
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

      toggleTask: (user, day, taskId) => {
        const scheduleKey =
          user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: state[scheduleKey][day].map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task,
            ),
          },
        }));
      },

      updateTask: (user, day, taskId, updates) => {
        const scheduleKey =
          user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: state[scheduleKey][day].map((task) =>
              task.id === taskId ? { ...task, ...updates } : task,
            ),
          },
        }));
      },

      addTask: (user, day, task) => {
        const scheduleKey =
          user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        const newTask = {
          ...task,
          id: Date.now().toString(),
          completed: false,
        };
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: [...state[scheduleKey][day], newTask],
          },
        }));
      },

      removeTask: (user, day, taskId) => {
        const scheduleKey =
          user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        set((state) => ({
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: state[scheduleKey][day].filter((task) => task.id !== taskId),
          },
        }));
      },

      importScheduleFromJSON: (user, data, selectedDays) => {
        const scheduleKey =
          user === "Lilia" ? "liliaSchedule" : "abdellahSchedule";
        set((state) => {
          const newSchedule = { ...state[scheduleKey] };
          selectedDays.forEach((day) => {
            if (data[day]) {
              newSchedule[day] = data[day].map((task, index) => ({
                id: `${day}-${index + 1}`,
                time: task.time || "",
                activity: task.activity || "",
                completed: false,
              }));
            }
          });
          return { [scheduleKey]: newSchedule };
        });
      },

      getCompletionPercentage: (user, day) => {
        const schedule =
          user === "Lilia" ? get().liliaSchedule : get().abdellahSchedule;
        const daySchedule = schedule[day] || [];
        if (daySchedule.length === 0) return 0;
        const completed = daySchedule.filter((task) => task.completed).length;
        return Math.round((completed / daySchedule.length) * 100);
      },

      endWeek: () => {
        const state = get();
        const liliaCompletion = Math.round(
          DAYS.reduce(
            (sum, day) => sum + state.getCompletionPercentage("Lilia", day),
            0,
          ) / DAYS.length,
        );
        const abdellahCompletion = Math.round(
          DAYS.reduce(
            (sum, day) => sum + state.getCompletionPercentage("Abdellah", day),
            0,
          ) / DAYS.length,
        );

        const currentStartDate = new Date(state.startDate);
        const nextStartDate = new Date(currentStartDate);
        nextStartDate.setDate(currentStartDate.getDate() + 7);

        set((prevState) => ({
          history: [
            ...prevState.history,
            {
              week: prevState.weekNumber,
              liliaCompletion,
              abdellahCompletion,
              date: new Date(prevState.startDate).toLocaleDateString(),
            },
          ],
          weekNumber: prevState.weekNumber + 1,
          startDate: nextStartDate.toISOString(),
          liliaSchedule: initialSchedule(),
          abdellahSchedule: initialSchedule(),
        }));
      },

      resetCurrentWeek: () => {
        set({
          liliaSchedule: initialSchedule(),
          abdellahSchedule: initialSchedule(),
        });
      },

      checkAndAutoReset: () => {
        const state = get();
        const now = new Date();
        const lastResetKey = `scheduleLastReset_${state.weekNumber}`;
        const lastResetStr = localStorage.getItem(lastResetKey);
        const lastReset = lastResetStr ? new Date(lastResetStr) : null;

        // If more than 7 days have passed since last reset, auto-reset
        if (
          !lastReset ||
          now.getTime() - lastReset.getTime() > 7 * 24 * 60 * 60 * 1000
        ) {
          state.endWeek();
          localStorage.setItem(lastResetKey, now.toISOString());
        }
      },
    }),
    {
      name: "schedule-storage",
    },
  ),
);
