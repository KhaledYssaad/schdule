import { createSlice } from '@reduxjs/toolkit';

export const USERS = ['Lilia', 'Abdallah'];

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    isUserSelected: false,
    currentUser: USERS[0],
    history: [],
  },
  reducers: {
    setIsUserSelected: (state, action) => {
      state.isUserSelected = action.payload;
    },
    setCurrentUser: (state, action) => {
      // Prevent changing user once selected
      if (!state.isUserSelected && USERS.includes(action.payload)) {
        state.currentUser = action.payload;
      }
    },
    saveToHistory: (state, action) => {
      state.history = [action.payload, ...state.history].slice(0, 10);
    },
  },
});

export const { setIsUserSelected, setCurrentUser, saveToHistory } = scheduleSlice.actions;
export default scheduleSlice.reducer;
