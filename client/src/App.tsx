import AuthRoute from '@/components/auth-route'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { path } from '@/constants/path'
import MainLayout from '@/layouts/mainLayout'
import PublicLayout from '@/layouts/publicLayout'
import GuestMenuOrder from '@/pages/guest/menu'
import TableOrder from '@/pages/guest/tableOrder'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Accounts from '@/pages/manage/accounts'
import DishesPage from '@/pages/manage/dishes'
import Setting from '@/pages/manage/setting'
import TablesPage from '@/pages/manage/tables'
import Profile from '@/pages/profile'
import { useAppSelector } from '@/redux/hook'
import { Navigate, Outlet, Route, Routes } from 'react-router'

const ProtectedRoute = () => {
  const { isAuth } = useAppSelector((state) => state.auth)
  return isAuth ? <Outlet /> : <Navigate to={'/login'} />
}

const RejectedRoute = () => {
  const { isAuth } = useAppSelector((state) => state.auth)
  return !isAuth ? <Outlet /> : <Navigate to={'/manage/dashboard'} />
}

function App() {
  return (
    <>
      <SidebarProvider>
        <Routes>
          <Route element={<AuthRoute />}>
            <Route element={<PublicLayout />}>
              <Route path={path.login} element={<Login />}></Route>
            </Route>
            <Route element={<MainLayout />}>
              <Route path={path.profile} element={<Profile />}></Route>
              <Route path={path.manageSetting} element={<Setting />}></Route>
              <Route path={path.manageAccounts} element={<Accounts />}></Route>
              <Route path={path.manageDishes} element={<DishesPage />}></Route>
              <Route path={path.manageTables} element={<TablesPage />}></Route>
            </Route>
            {/* both */}
            <Route element={<PublicLayout />}>
              <Route path='/' element={<Home />}></Route>
              <Route path='/table-order/:id' element={<TableOrder />}></Route>
              <Route path='/table-order/menu' element={<GuestMenuOrder />}></Route>
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </SidebarProvider>
    </>
  )
}

export default App
