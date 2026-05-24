export const state = {
  currentUser: null,
  clientes: {},
  citas: {},
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  activeTab: 'clientes',
  selectedClienteKey: null,
  selectedCocheKey: null,
  viewHistory: ['list'],  // 'list' | 'cliente' | 'coche'
  searchClientes: '',
  searchCoches: '',
};
