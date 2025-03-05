import AuthRoute from '@/components/auth-route'
import { Toaster } from '@/components/ui/toaster'
import { path } from '@/constants/path'
import GuestLayout from '@/layouts/guest-layout'
import ManageLayout from '@/layouts/manage-layout'
import TableOrder from '@/pages/guest'
import GuestMenuOrder2 from '@/pages/guest/menu/guest-menu-order'
import GuestOrder from '@/pages/guest/orders'
import Login from '@/pages/login'
import Accounts from '@/pages/manage/accounts'
import DashboardPage from '@/pages/manage/dashboard'
import DishesPage from '@/pages/manage/dishes'
import ManageOrderPage from '@/pages/manage/orders'
import Setting from '@/pages/manage/setting'
import TablesPage from '@/pages/manage/tables'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <>
      // login
      <Routes>
        <Route path={path.login} element={<Login />}></Route>
        <Route path='/table-order/:id' element={<TableOrder />}></Route>
      </Routes>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route element={<ManageLayout />}>
            <Route path={path.manageDashboard} element={<DashboardPage />}></Route>
            <Route path={path.manageSetting} element={<Setting />}></Route>
            <Route path={path.manageAccounts} element={<Accounts />}></Route>
            <Route path={path.manageDishes} element={<DishesPage />}></Route>
            <Route path={path.manageTables} element={<TablesPage />}></Route>
            <Route path={path.manageOrders} element={<ManageOrderPage />}></Route>
          </Route>
          <Route element={<GuestLayout />}>
            <Route path='/guest/menu' element={<GuestMenuOrder2 />}></Route>
            <Route path='/guest/orders' element={<GuestOrder />}></Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
