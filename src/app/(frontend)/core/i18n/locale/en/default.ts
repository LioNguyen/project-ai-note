// Default namespace for English translations
const defaultTranslations = {
  // Common
  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    apply: "Apply",
    close: "Close",
    back: "Back",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    reset: "Reset",
    refresh: "Refresh",
  },

  // Navigation
  nav: {
    home: "Home",
    dashboard: "Dashboard",
    users: "Users",
    settings: "Settings",
    profile: "Profile",
    logout: "Logout",
    login: "Login",
    register: "Register",
  },

  // Authentication
  auth: {
    loginTitle: "Sign In",
    registerTitle: "Sign Up",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    firstName: "First Name",
    lastName: "Last Name",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
    loginSuccess: "Successfully logged in",
    logoutSuccess: "Successfully logged out",
    registrationSuccess: "Account created successfully",
  },

  // Forms
  form: {
    required: "This field is required",
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 8 characters",
    passwordsDoNotMatch: "Passwords do not match",
    invalidPhone: "Please enter a valid phone number",
    invalidUrl: "Please enter a valid URL",
  },

  // Users
  users: {
    title: "Users",
    createUser: "Create User",
    editUser: "Edit User",
    deleteUser: "Delete User",
    userDeleted: "User deleted successfully",
    userCreated: "User created successfully",
    userUpdated: "User updated successfully",
    name: "Name",
    role: "Role",
    status: "Status",
    createdAt: "Created At",
    lastLogin: "Last Login",
    actions: "Actions",
  },

  // Dashboard
  dashboard: {
    title: "Dashboard",
    welcome: "Welcome back, {{name}}!",
    totalUsers: "Total Users",
    activeUsers: "Active Users",
    totalRevenue: "Total Revenue",
    monthlyGrowth: "Monthly Growth",
    recentActivity: "Recent Activity",
    userGrowth: "User Growth",
    revenue: "Revenue",
  },

  // Errors
  errors: {
    generic: "Something went wrong. Please try again.",
    network: "Network error. Please check your connection.",
    unauthorized: "You are not authorized to perform this action.",
    forbidden: "Access forbidden.",
    notFound: "The requested resource was not found.",
    serverError: "Internal server error. Please try again later.",
    validationError: "Please check your input and try again.",
  },

  // Theme
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
    toggleTheme: "Toggle theme",
  },

  // Language
  language: {
    en: "English",
    vi: "Tiếng Việt",
    switchLanguage: "Switch language",
  },

  // Navigation Bar
  navbar: {
    appName: "AI Note",
    addNote: "Add Note",
  },

  // Notes
  notes: {
    title: "Notes",
    createNote: "Create Note",
    editNote: "Edit Note",
    deleteNote: "Delete Note",
    addNote: "Add Note",
    noteTitle: "Note title",
    noteContent: "Note content",
    searchPlaceholder: "Search notes...",
    sortBy: "Sort by",
    sortUpdatedDesc: "Newest first",
    sortUpdatedAsc: "Oldest first",
    sortTitleAsc: "Title (A-Z)",
    sortTitleDesc: "Title (Z-A)",
    noNotes: "No notes found",
    noNotesDescription:
      "You don't have any notes yet. Why don't you create one?",
    noSearchResults: 'No notes found matching "{{query}}"',
    noteCreated: "Note created successfully",
    noteUpdated: "Note updated successfully",
    noteDeleted: "Note deleted successfully",
    confirmDelete: "Are you sure you want to delete this note?",
    submit: "Submit",
    somethingWentWrong: "Something went wrong. Please try again.",
    successfully: "Successfully!",
    deleteSuccessfully: "Delete Successfully!",
    found: 'Found {{count}} note{{plural}} matching "{{query}}"',
    total: "{{count}} note{{plural}} total",
    titlePlaceholder: "Enter note title...",
    contentPlaceholder:
      "Enter note content (supports markdown: # heading, **bold**, - list)...",
    previewMode: "Preview Mode",
    editMode: "Edit Mode",
  },

  // Chat
  chat: {
    title: "AI Chat",
    placeholder: "How many notes are there?...",
    send: "Send",
    thinking: "Thinking...",
    errorMessage: "Something went wrong. Please try again.",
    clearChat: "Clear chat",
    newChat: "New chat",
    askQuestion: "Ask the AI a question about your notes",
  },
} as const;

export default defaultTranslations;
