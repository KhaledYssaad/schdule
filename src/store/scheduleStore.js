import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '../utils/generateId'
import { DAYS, getWeekRange, getWeekLabel } from '../utils/dateHelpers'

export const USERS = ['lilia', 'abdellah']

const emptySchedule = () =>
  Object.fromEntries(DAYS.map(day => [day, []]))

const useScheduleStore = create(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),

      isUserSelected: false,
      setIsUserSelected: (val) => set({ isUserSelected: val }),

      currentUser: USERS[0],
      
      // Store the end date of the currently active week to check for reset
      weekEndDate: getWeekRange(new Date()).end.toISOString(),

      schedules: Object.fromEntries(USERS.map(u => [u, emptySchedule()])),
      history: [],

      // Prevent changing user once selected
      setCurrentUser: (user) => {
        if (!USERS.includes(user) || get().isUserSelected) return
        set({ currentUser: user })
      },

      checkAndResetWeek: () => {
        const now = new Date()
        const lastEndDate = new Date(get().weekEndDate)
        if (now > lastEndDate) {
          const newWeekRange = getWeekRange(now)
          get().resetWeek(getWeekLabel())
          set({ weekEndDate: newWeekRange.end.toISOString() })
        }
      },

      addTask: (user, day, { activity, time }) => {
        get().checkAndResetWeek()
        if (!USERS.includes(user)) return
        if (!DAYS.includes(day)) return
        if (!activity || !time) return
        const newTask = {
          id: generateId(),
          activity: activity.trim(),
          time: time.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          schedules: {
            ...state.schedules,
            [user]: {
              ...state.schedules[user],
              [day]: [...state.schedules[user][day], newTask],
            },
          },
        }))
      },

      toggleTask: (user, day, taskId) => {
        get().checkAndResetWeek()
        if (!USERS.includes(user)) return
        if (!DAYS.includes(day)) return
        set((state) => ({
          schedules: {
            ...state.schedules,
            [user]: {
              ...state.schedules[user],
              [day]: state.schedules[user][day].map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            },
          },
        }))
      },

      deleteTask: (user, day, taskId) => {
        get().checkAndResetWeek()
        if (!USERS.includes(user)) return
        if (!DAYS.includes(day)) return
        set((state) => ({
          schedules: {
            ...state.schedules,
            [user]: {
              ...state.schedules[user],
              [day]: state.schedules[user][day].filter((task) => task.id !== taskId),
            },
          },
        }))
      },

      editTask: (user, day, taskId, updates) => {
        get().checkAndResetWeek()
        if (!USERS.includes(user)) return
        if (!DAYS.includes(day)) return
        set((state) => ({
          schedules: {
            ...state.schedules,
            [user]: {
              ...state.schedules[user],
              [day]: state.schedules[user][day].map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      ...(updates.activity ? { activity: updates.activity.trim() } : {}),
                      ...(updates.time ? { time: updates.time.trim() } : {}),
                    }
                  : task
              ),
            },
          },
        }))
      },

      importSchedule: (user, rawJSON) => {
        if (!USERS.includes(user)) return
        const newUserSchedule = Object.fromEntries(
          DAYS.map((day) => [
            day,
            (rawJSON[day] || []).map((item) => ({
              id: generateId(),
              activity: item.activity.trim(),
              time: item.time.trim(),
              completed: false,
              createdAt: new Date().toISOString(),
            })),
          ])
        )
        set((state) => ({
          schedules: {
            ...state.schedules,
            [user]: newUserSchedule,
          },
        }))
      },

      saveToHistory: (weekLabel) => {
        const { schedules } = get()
        const snapshot = {
          id: generateId(),
          weekLabel,
          date: new Date().toISOString(),
          schedules: JSON.parse(JSON.stringify(schedules)),
        }
        set((state) => ({
          history: [snapshot, ...state.history].slice(0, 10),
        }))
      },

      resetWeek: (weekLabel) => {
        get().saveToHistory(weekLabel)
        set({
          schedules: Object.fromEntries(USERS.map(u => [u, emptySchedule()])),
        })
      },
    }),
    {
      name: 'schdule-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true)
      },
    }
  )
)

export default useScheduleStore
