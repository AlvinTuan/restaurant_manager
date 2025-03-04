import AuthRoute from '@/components/auth-route'
import { Toaster } from '@/components/ui/toaster'
import { path } from '@/constants/path'
import MainLayout from '@/layouts/main-layout'
import PublicLayout from '@/layouts/public-layout'
import TableOrder from '@/pages/guest'
import GuestMenuOrder from '@/pages/guest/menu'
import GuestOrder from '@/pages/guest/orders'
import Home from '@/pages/home'
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
      <Routes>
        <Route path={path.login} element={<Login />}></Route>
      </Routes>
      <Routes>
        <Route element={<AuthRoute />}>
          {/* <Route element={<PublicLayout />}> */}
          {/* </Route> */}
          <Route element={<MainLayout />}>
            <Route path={path.manageDashboard} element={<DashboardPage />}></Route>
            <Route path={path.manageSetting} element={<Setting />}></Route>
            <Route path={path.manageAccounts} element={<Accounts />}></Route>
            <Route path={path.manageDishes} element={<DishesPage />}></Route>
            <Route path={path.manageTables} element={<TablesPage />}></Route>
            <Route path={path.manageOrders} element={<ManageOrderPage />}></Route>
          </Route>
          {/* both */}
          <Route element={<PublicLayout />}>
            <Route path='/' element={<Home />}></Route>
            <Route path='/table-order/:id' element={<TableOrder />}></Route>
            <Route path='/guest/menu' element={<GuestMenuOrder />}></Route>
            <Route path='/guest/orders' element={<GuestOrder />}></Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
