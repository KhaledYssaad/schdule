import { create } from "zustand";
import { persist as persistMiddleware } from "zustand/middleware";
import { jsonBin } from "../utils/jsonBinClient";

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
      abdallahSchedule: initialSchedule(),
      weekNumber: 1,
      startDate: getMonday(new Date()).toISOString(),
      history: [],
      isLoading: false,
      isSaving: false,
      lastSync: null,
      lastLocalUpdate: 0, // Timestamp to track when the last local change happened

      setCurrentUser: (user) => set({ currentUser: user }),

      // --- JSONBin Operations ---

      fetchInitialData: async () => {
        const state = get();
        // Prevent overwriting if we are currently saving or if a change just happened locally
        if (state.isLoading || state.isSaving || (Date.now() - state.lastLocalUpdate < 5000)) return;
        
        set({ isLoading: true });
        
        try {
          const [liliaData, abdallahData] = await Promise.all([
            jsonBin.fetchData("Lilia").catch(() => null),
            jsonBin.fetchData("Abdallah").catch(() => null)
          ]);

          const updates = {};
          const now = get(); // Get fresh state after async call

          // Safety: Don't overwrite if a change happened while fetching
          if (now.isSaving || (Date.now() - now.lastLocalUpdate < 5000)) return;

          if (liliaData && liliaData.schedule) {
            updates.liliaSchedule = liliaData.schedule;
            if (liliaData.weekNumber !== undefined) updates.weekNumber = liliaData.weekNumber;
            if (liliaData.startDate) updates.startDate = liliaData.startDate;
            if (liliaData.history) updates.history = liliaData.history;
          }

          if (abdallahData && abdallahData.schedule) {
            updates.abdallahSchedule = abdallahData.schedule;
            if (updates.weekNumber === undefined || (abdallahData.weekNumber > (updates.weekNumber || 0))) {
              updates.weekNumber = abdallahData.weekNumber;
              updates.startDate = abdallahData.startDate;
              updates.history = abdallahData.history;
            }
          }

          if (Object.keys(updates).length > 0) {
            set(updates);
          }
          set({ lastSync: new Date().toLocaleTimeString() });
        } catch (error) {
          console.error("Cloud Sync Error:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      syncToCloud: async (user) => {
        set({ isSaving: true, lastLocalUpdate: Date.now() });
        try {
          const latestCloudData = await jsonBin.fetchData(user).catch(() => null);
          const state = get();
          
          const data = {
            schedule: user === "Lilia" ? state.liliaSchedule : state.abdallahSchedule,
            weekNumber: Math.max(state.weekNumber, latestCloudData?.weekNumber || 0),
            startDate: state.startDate,
            history: (state.history.length >= (latestCloudData?.history?.length || 0)) 
                     ? state.history 
                     : latestCloudData.history
          };

          await jsonBin.updateData(user, data);
          
          if (latestCloudData && latestCloudData.weekNumber > state.weekNumber) {
            set({ 
              weekNumber: latestCloudData.weekNumber,
              history: latestCloudData.history
            });
          }

          set({ lastSync: new Date().toLocaleTimeString() });
        } catch (error) {
          console.error(`Error syncing ${user} to cloud:`, error);
        } finally {
          set({ isSaving: false });
        }
      },

      toggleTask: async (user, day, taskId) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdallahSchedule";
        set((state) => ({
          lastLocalUpdate: Date.now(),
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: (state[scheduleKey][day] || []).map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
          },
        }));
        await get().syncToCloud(user);
      },

      updateTask: async (user, day, taskId, updates) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdallahSchedule";
        set((state) => ({
          lastLocalUpdate: Date.now(),
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: (state[scheduleKey][day] || []).map((task) =>
              task.id === taskId ? { ...task, ...updates } : task
            ),
          },
        }));
        await get().syncToCloud(user);
      },

      addTask: async (user, day, task) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdallahSchedule";
        const taskId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const newTask = { ...task, id: taskId, completed: false };
        
        set((state) => ({
          lastLocalUpdate: Date.now(),
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: [...(state[scheduleKey][day] || []), newTask],
          },
        }));
        await get().syncToCloud(user);
      },

      removeTask: async (user, day, taskId) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdallahSchedule";
        set((state) => ({
          lastLocalUpdate: Date.now(),
          [scheduleKey]: {
            ...state[scheduleKey],
            [day]: (state[scheduleKey][day] || []).filter((task) => task.id !== taskId),
          },
        }));
        await get().syncToCloud(user);
      },

      importScheduleFromJSON: async (user, data, selectedDays) => {
        const scheduleKey = user === "Lilia" ? "liliaSchedule" : "abdallahSchedule";
        set((state) => {
          const newSchedule = { ...state[scheduleKey] };
          selectedDays.forEach((day) => {
            if (data[day] && Array.isArray(data[day])) {
              newSchedule[day] = data[day].map((task, index) => ({
                id: `${day}-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 3)}`,
                time: task.time || "",
                activity: task.activity || "",
                completed: !!task.completed,
              }));
            }
          });
          return { lastLocalUpdate: Date.now(), [scheduleKey]: newSchedule };
        });
        await get().syncToCloud(user);
      },

      getCompletionPercentage: (user, day) => {
        const schedule = user === "Lilia" ? get().liliaSchedule : get().abdallahSchedule;
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
        const abdallahCompletion = Math.round(
          DAYS.reduce((sum, day) => sum + state.getCompletionPercentage("Abdallah", day), 0) / DAYS.length
        );

        const currentStartDate = new Date(state.startDate);
        const nextStartDate = new Date(currentStartDate);
        nextStartDate.setDate(currentStartDate.getDate() + 7);

        const newHistory = [
          ...state.history,
          {
            week: state.weekNumber,
            liliaCompletion,
            abdallahCompletion,
            date: new Date(state.startDate).toLocaleDateString(),
          },
        ];

        set({
          lastLocalUpdate: Date.now(),
          history: newHistory,
          weekNumber: state.weekNumber + 1,
          startDate: nextStartDate.toISOString(),
          liliaSchedule: initialSchedule(),
          abdallahSchedule: initialSchedule(),
        });

        await Promise.all([
          get().syncToCloud("Lilia"),
          get().syncToCloud("Abdallah")
        ]);
      },

      resetCurrentWeek: async () => {
        set({
          lastLocalUpdate: Date.now(),
          liliaSchedule: initialSchedule(),
          abdallahSchedule: initialSchedule(),
        });
        await Promise.all([
          get().syncToCloud("Lilia"),
          get().syncToCloud("Abdallah")
        ]);
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
        liliaSchedule: state.liliaSchedule,
        abdallahSchedule: state.abdallahSchedule,
        weekNumber: state.weekNumber,
        startDate: state.startDate,
        history: state.history
      }),
    }
  )
);
