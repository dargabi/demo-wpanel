import { createSlice } from '@reduxjs/toolkit';

/**
 * UI slice for managing application UI state
 * Handles sidebar state, notifications, and global loading states
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    notifications: [],
    globalLoading: false,
    darkMode: localStorage.getItem('darkMode') === 'true',
    modals: {
      createClient: false,
      createReport: false,
      confirmDelete: false,
    },
    dialogs: {
      deleteItemId: null,
      deleteItemType: null,
    }
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
        createdAt: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(
        notification => notification.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    setDeleteDialog: (state, action) => {
      state.dialogs.deleteItemId = action.payload.id;
      state.dialogs.deleteItemType = action.payload.type;
      state.modals.confirmDelete = true;
    },
    clearDeleteDialog: (state) => {
      state.dialogs.deleteItemId = null;
      state.dialogs.deleteItemType = null;
      state.modals.confirmDelete = false;
    }
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setGlobalLoading,
  toggleDarkMode,
  openModal,
  closeModal,
  setDeleteDialog,
  clearDeleteDialog
} = uiSlice.actions;

export default uiSlice.reducer;
