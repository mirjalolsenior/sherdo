export type Language = 'uz' | 'en';

export const translations = {
  uz: {
    // Navigation
    sherdor: 'Sherdor',
    barxan: 'Barxan',
    qidiruv: 'Qidiruv',
    hisobotlar: 'Hisobotlar',
    arxiv: 'Arxiv',
    admin: 'Admin',
    eventManager: 'Event Manager',
    
    // Event Messages
    no_events: "To'y yo'q",
    no_events_found: "To'y topilmadi",
    select_date_and_search: 'Sana tanlang va qidiruv qiling',
    
    // Buttons
    add_event: "Qo'shish",
    add: "Qo'sh",
    search: 'Qidiruv',
    edit: 'Tahrir',
    delete: "O'chirish",
    save: 'Saqlash',
    cancel: 'Bekor qilish',
    logout: 'Chiqish',
    unlock: 'Ochish',
    loading: 'Yuklanmoqda...',
    creating: "Yaratilmoqda...",
    adding: "Qo'shilmoqda...",
    
    // Form Labels
    clientName: "Mijoz nomi",
    phone: 'Telefon',
    date: 'Sana',
    time: 'Vaqt',
    totalPrice: "Jami narx",
    initialPayment: "Dastlabki to'lov",
    note: 'Izoh',
    selectDate: 'Sanani tanlang',
    paymentAmount: "To'lov miqdori",
    password: "Parol",
    enterPassword: 'Parolni kiriting',
    
    // Time Options
    morning: 'Ertalab',
    afternoon: 'Abet',
    evening: 'Kechki',
    
    // Event Details
    client: "Mijoz",
    type: 'Turi',
    total: "Jami",
    paid: "To'langan",
    remaining: "Qolgan",
    payments: "To'lovlar",
    noPayments: "To'lov yo'q",
    
    // Admin
    adminPanel: 'Admin Panel',
    enterPasswordForAdmin: 'Admin panelga kirish uchun parolni kiriting',
    allEvents: 'Barcha tadbirlar',
    areYouSure: "Ishonchingiz komilmi?",
    
    // Reports
    totalEvents: 'Jami tadbirlar',
    totalMoney: "Jami pul",
    totalPaid: "Jami to'langan",
    remainingAmount: "Qolgan miqdor",
    
    // Archive
    completedEvents: "To'langan tadbirlar",
    
    // Login
    login: 'Kirish',
    incorrectPassword: 'Parol noto\'g\'ri',
    
    // Search
    selectDateAndSearch: 'Sanani tanlang va qidiruv tugmasini bosing',
    
    // Messages
    addEvent: "Tadbir qo'shish",
    addPayment: "To'lov qo'shish",
    viewDetails: "Batafsil ko'rish",
    eventType: "Tadbir turini boshqarish",
    upcomingEvents: "Kelayotgan tadbirlar",
    manageEvents: "Tadbirlarni boshqarish",
    addFirstEvent: "Birinchi tadbirni qo'shish uchun shakl to'ldiring",
    fillTheForm: "Tadbir ma'lumotlarini kiriting",
    enterClientName: "Mijoz nomini kiriting",
    addNotes: "Qo'shimcha ma'lumot qo'shing",
    clickToViewDetails: "Batafsil ko'rish uchun bosing",
    completed: "To'langan",
    progress: "Taraqqiyot",
    navigation: "Navigatsiya",
    eventFullyPaid: "Tadbir 100% to'langan va arxivga ko'chirildi",
    enterAmount: "To'lov summasi kiriting",
    monthlyAnalysis: "Oylik tahlil",
    generalReports: "Umumiy hisobotlar",
    month: "Oy",
    year: "Yil",
    totalOrders: "Jami zakazlar",
    usedItems: "Ishlatilgan tovarlar",
    totalRevenue: "Jami tushum",
    totalDebt: "Jami qarzdorlik",
    paymentRate: "To'lov to'plash darajasi",
    avgOrderValue: "O'rtacha zakaz qiymati",
    dailyOrders: "Kunlik zakazlar",
    paymentStatus: "To'lov holati",
    appTitle: "Toyxona",
    searchEvents: "Tadbirlarni qidiruv",
    reports: "Hisobotlar va tahlil",
    completedEvents: "To'langan tadbirlar",
  },
  
  en: {
    // Navigation
    sherdor: 'Sherdor',
    barxan: 'Barxan',
    qidiruv: 'Search',
    hisobotlar: 'Reports',
    arxiv: 'Archive',
    admin: 'Admin',
    eventManager: 'Event Manager',
    
    // Event Messages
    no_events: 'No events',
    no_events_found: 'No events found',
    select_date_and_search: 'Select date and search',
    
    // Buttons
    add_event: 'Add Event',
    add: 'Add',
    search: 'Search',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout',
    unlock: 'Unlock',
    loading: 'Loading...',
    creating: 'Creating...',
    adding: 'Adding...',
    
    // Form Labels
    clientName: 'Client Name',
    phone: 'Phone',
    date: 'Date',
    time: 'Time',
    totalPrice: 'Total Price',
    initialPayment: 'Initial Payment',
    note: 'Note',
    selectDate: 'Select Date',
    paymentAmount: 'Payment Amount',
    password: 'Password',
    enterPassword: 'Enter password',
    
    // Time Options
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    
    // Event Details
    client: 'Client',
    type: 'Type',
    total: 'Total',
    paid: 'Paid',
    remaining: 'Remaining',
    payments: 'Payments',
    noPayments: 'No payments',
    
    // Admin
    adminPanel: 'Admin Panel',
    enterPasswordForAdmin: 'Enter password to access admin panel',
    allEvents: 'All Events',
    areYouSure: 'Are you sure?',
    
    // Reports
    totalEvents: 'Total Events',
    totalMoney: 'Total Money',
    totalPaid: 'Total Paid',
    remainingAmount: 'Remaining',
    
    // Archive
    completedEvents: 'Completed Events',
    
    // Login
    login: 'Login',
    incorrectPassword: 'Incorrect password',
    
    // Search
    selectDateAndSearch: 'Select a date and click search',
    
    // Messages
    addEvent: 'Add Event',
    addPayment: 'Add Payment',
    viewDetails: 'View Details',
    eventType: "Event Management",
    upcomingEvents: "Upcoming Events",
    manageEvents: "Manage Events",
    addFirstEvent: "Fill the form to add your first event",
    fillTheForm: "Enter event details below",
    enterClientName: "Enter client name",
    addNotes: "Add additional notes",
    clickToViewDetails: "Click to view details",
    completed: "Completed",
    progress: "Progress",
    navigation: "Navigation",
    eventFullyPaid: "Event is 100% paid and moved to archive",
    enterAmount: "Enter payment amount",
    monthlyAnalysis: "Monthly Analysis",
    generalReports: "General Reports",
    month: "Month",
    year: "Year",
    totalOrders: "Total Orders",
    usedItems: "Used Items",
    totalRevenue: "Total Revenue",
    totalDebt: "Total Debt",
    paymentRate: "Payment Collection Rate",
    avgOrderValue: "Average Order Value",
    dailyOrders: "Daily Orders",
    paymentStatus: "Payment Status",
    appTitle: "Catering",
    searchEvents: "Search Events",
    reports: "Reports and Analysis",
    completedEvents: "Completed Events",
  },
};
