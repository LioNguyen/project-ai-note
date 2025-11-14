// Default namespace for Vietnamese translations
const defaultTranslations = {
  // Common
  common: {
    loading: "Đang tải...",
    error: "Lỗi",
    success: "Thành công",
    warning: "Cảnh báo",
    info: "Thông tin",
    cancel: "Hủy",
    confirm: "Xác nhận",
    save: "Lưu",
    delete: "Xóa",
    edit: "Chỉnh sửa",
    create: "Tạo mới",
    update: "Cập nhật",
    search: "Tìm kiếm",
    filter: "Lọc",
    clear: "Xóa",
    apply: "Áp dụng",
    close: "Đóng",
    back: "Quay lại",
    next: "Tiếp theo",
    previous: "Trước",
    submit: "Gửi",
    reset: "Đặt lại",
    refresh: "Làm mới",
  },

  // Navigation
  nav: {
    home: "Trang chủ",
    dashboard: "Bảng điều khiển",
    users: "Người dùng",
    settings: "Cài đặt",
    profile: "Hồ sơ",
    logout: "Đăng xuất",
    login: "Đăng nhập",
    register: "Đăng ký",
  },

  // Authentication
  auth: {
    loginTitle: "Đăng nhập",
    registerTitle: "Đăng ký",
    email: "Email",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    firstName: "Họ",
    lastName: "Tên",
    rememberMe: "Ghi nhớ đăng nhập",
    forgotPassword: "Quên mật khẩu?",
    noAccount: "Chưa có tài khoản?",
    hasAccount: "Đã có tài khoản?",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    signOut: "Đăng xuất",
    loginSuccess: "Đăng nhập thành công",
    logoutSuccess: "Đăng xuất thành công",
    registrationSuccess: "Tạo tài khoản thành công",
  },

  // Forms
  form: {
    required: "Trường này là bắt buộc",
    invalidEmail: "Vui lòng nhập địa chỉ email hợp lệ",
    passwordTooShort: "Mật khẩu phải có ít nhất 8 ký tự",
    passwordsDoNotMatch: "Mật khẩu không khớp",
    invalidPhone: "Vui lòng nhập số điện thoại hợp lệ",
    invalidUrl: "Vui lòng nhập URL hợp lệ",
  },

  // Users
  users: {
    title: "Người dùng",
    createUser: "Tạo người dùng",
    editUser: "Chỉnh sửa người dùng",
    deleteUser: "Xóa người dùng",
    userDeleted: "Xóa người dùng thành công",
    userCreated: "Tạo người dùng thành công",
    userUpdated: "Cập nhật người dùng thành công",
    name: "Tên",
    role: "Vai trò",
    status: "Trạng thái",
    createdAt: "Ngày tạo",
    lastLogin: "Lần đăng nhập cuối",
    actions: "Thao tác",
  },

  // Dashboard
  dashboard: {
    title: "Bảng điều khiển",
    welcome: "Chào mừng trở lại, {{name}}!",
    totalUsers: "Tổng người dùng",
    activeUsers: "Người dùng hoạt động",
    totalRevenue: "Tổng doanh thu",
    monthlyGrowth: "Tăng trưởng hàng tháng",
    recentActivity: "Hoạt động gần đây",
    userGrowth: "Tăng trưởng người dùng",
    revenue: "Doanh thu",
  },

  // Errors
  errors: {
    generic: "Đã xảy ra lỗi. Vui lòng thử lại.",
    network: "Lỗi mạng. Vui lòng kiểm tra kết nối.",
    unauthorized: "Bạn không có quyền thực hiện hành động này.",
    forbidden: "Truy cập bị cấm.",
    notFound: "Không tìm thấy tài nguyên được yêu cầu.",
    serverError: "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.",
    validationError: "Vui lòng kiểm tra dữ liệu nhập và thử lại.",
  },

  // Theme
  theme: {
    light: "Sáng",
    dark: "Tối",
    system: "Hệ thống",
    toggleTheme: "Chuyển đổi chủ đề",
  },

  // Language
  language: {
    en: "English",
    vi: "Tiếng Việt",
    switchLanguage: "Chuyển đổi ngôn ngữ",
  },

  // Navigation Bar
  navbar: {
    appName: "Ghi Chú AI",
    addNote: "Thêm Ghi Chú",
  },

  // Notes
  notes: {
    title: "Ghi chú",
    createNote: "Tạo ghi chú",
    editNote: "Chỉnh sửa ghi chú",
    deleteNote: "Xóa ghi chú",
    addNote: "Thêm Ghi Chú",
    noteTitle: "Tiêu đề ghi chú",
    noteContent: "Nội dung ghi chú",
    searchPlaceholder: "Tìm kiếm ghi chú...",
    sortBy: "Sắp xếp theo",
    sortUpdatedDesc: "Mới nhất trước",
    sortUpdatedAsc: "Cũ nhất trước",
    sortTitleAsc: "Tiêu đề (A-Z)",
    sortTitleDesc: "Tiêu đề (Z-A)",
    noNotes: "Không tìm thấy ghi chú",
    noNotesDescription: "Bạn chưa có ghi chú nào. Hãy tạo một ghi chú mới?",
    noSearchResults: 'Không tìm thấy ghi chú nào khớp với "{{query}}"',
    noteCreated: "Tạo ghi chú thành công",
    noteUpdated: "Cập nhật ghi chú thành công",
    noteDeleted: "Xóa ghi chú thành công",
    confirmDelete: "Bạn có chắc chắn muốn xóa ghi chú này?",
    submit: "Gửi",
    somethingWentWrong: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    successfully: "Thành công!",
    deleteSuccessfully: "Xóa thành công!",
    found: 'Tìm thấy {{count}} ghi chú khớp với "{{query}}"',
    total: "Tổng cộng {{count}} ghi chú",
    titlePlaceholder: "Nhập tiêu đề ghi chú...",
    contentPlaceholder:
      "Nhập nội dung ghi chú (hỗ trợ markdown: # tiêu đề, **in đậm**, - danh sách)...",
    previewMode: "Chế độ xem",
    editMode: "Chế độ chỉnh sửa",
  },

  // Trial Mode
  trial: {
    trialMode: "Chế Độ Dùng Thử",
    notesRemaining: "ghi chú còn lại",
    chatsRemaining: "lượt chat còn lại",
    noteLimitReached: "Đã hết lượt tạo ghi chú!",
    chatLimitReached: "Đã hết lượt chat!",
    signUpForUnlimited: "Đăng ký để sử dụng không giới hạn!",
    signUp: "Đăng Ký",
    unlockUnlimited: "Đăng nhập để mở khóa tính năng unlimited",
    benefits: "Lợi ích khi đăng ký:",
    benefitUnlimitedNotes: "Tạo không giới hạn ghi chú",
    benefitUnlimitedChat: "Chat không giới hạn với AI",
    benefitPermanentStorage: "Lưu trữ vĩnh viễn",
    benefitAiSearch: "Tìm kiếm & chat với AI",
    benefitSecure: "Bảo mật & riêng tư",
    limitReachedTitle: "Đã hết lượt dùng thử! 🎯",
    limitReachedDescription:
      "Bạn đã tạo 5 ghi chú ở chế độ dùng thử. Đăng ký để mở khóa không giới hạn ghi chú và tính năng cao cấp!",
    premiumFeatures: "Tính năng cao cấp:",
    maybeLater: "Để sau",
    signUpFree: "Đăng ký miễn phí",
  },

  // Dialog
  dialog: {
    unsavedChangesTitle: "Có thay đổi chưa lưu",
    unsavedChangesDescription:
      "Bạn có thay đổi chưa được lưu. Bạn có chắc chắn muốn thoát không?",
    continueEditing: "Tiếp tục chỉnh sửa",
    discardChanges: "Bỏ thay đổi",
  },

  // Chat
  chat: {
    title: "Trò chuyện AI",
    placeholder: "Tôi có bao nhiêu ghi chú?...",
    send: "Gửi",
    thinking: "Đang suy nghĩ...",
    errorMessage: "Đã có lỗi xảy ra. Vui lòng thử lại.",
    clearChat: "Xóa trò chuyện",
    newChat: "Trò chuyện mới",
    askQuestion: "Hỏi AI về ghi chú của bạn",
    limitReached: "Đã hết lượt chat",
    upgradeMessage: "Đã hết lượt chat. Đăng ký để tiếp tục.",
    remainingChats: "lượt chat còn lại",
    aiAssistant: "Trợ Lý AI",
    emptyStateSubtitle: "Hỏi tôi bất cứ điều gì về ghi chú của bạn",
  },
} as const;

export default defaultTranslations;
