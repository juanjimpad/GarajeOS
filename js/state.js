export const state = {
  currentUser: null,
  clientes: {},
  citas: {},
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  calendarView: 'month',
  calendarDate: new Date().toISOString().split('T')[0],
  activeTab: 'calendario',
  selectedClienteKey: null,
  selectedCocheKey: null,
  viewHistory: ['list'],  // 'list' | 'cliente' | 'coche'
  searchClientes: '',
  searchCoches: '',
  calendarSecret: null,
};
