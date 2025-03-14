export enum path {
  home = '/',
  login = '/login',
  logout = '/logout',

  // manage
  manageDashboard = '/manage/dashboard',
  manageSetting = '/manage/setting',
  manageAccounts = '/manage/accounts',
  manageDishes = '/manage/dishes',
  manageTables = '/manage/tables',
  manageOrders = '/manage/orders',

  // guest
  guestLogin = '/table-order/:id',
  guestMenu = '/guest/menu',
  guestOrder = '/guest/orders'
}
