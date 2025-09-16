export const BASE_URL = "http://localhost:8000"

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (Admin only)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
    GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assigned tasks)
    GET_ALL_TASKS_EVERYONE: "/api/tasks/all",
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
    CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist
  },

  COM_STATION: {
    GET_ALL_COM_STATIONS: "/api/com-stations",
    CREATE_COM_STATION: "/api/com-stations",
    UPDATE_COM_STATION: (comStationId) => `/api/com-stations/${comStationId}`,
    DELETE_COM_STATION: (comStationId) => `/api/com-stations/${comStationId}`,
  },

  PROVIDERS: {
    GET_ALL_PROVIDERS: "/api/providers",
    CREATE_PROVIDER: "/api/providers",
    UPDATE_PROVIDER: (providerId) => `/api/providers/${providerId}`,
    DELETE_PROVIDER: (providerId) => `/api/providers/${providerId}`,
  },

  WHITEBOARD: {
    GET_WHITEBOARD: "/api/lab-whiteboard",
    UPDATE_WHITEBOARD: "/api/lab-whiteboard",
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel/PDF report
    EXPORT_USERS: "/api/reports/export/users", // Download user-task report
    EXPORT_COM_STATIONS: "/api/reports/export/com-stations", // Download computer stations report
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-profile-image",
  },
}