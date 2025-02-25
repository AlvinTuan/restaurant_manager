import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { path } from '@/constants/path'
import MainLayout from '@/layouts/mainLayout'
import PublicLayout from '@/layouts/publicLayout'
import { getAccessTokenFromLS } from '@/lib/auth'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Accounts from '@/pages/manage/accounts'
import DishesPage from '@/pages/manage/dishes'
import Setting from '@/pages/manage/setting'
import TablesPage from '@/pages/manage/tables'
import Profile from '@/pages/profile'
import { Navigate, Outlet, Route, Routes } from 'react-router'

const ProtectedRoute = () => {
  const accessToken = getAccessTokenFromLS()
  return accessToken ? <Outlet /> : <Navigate to={'/login'} />
}

const RejectedRoute = () => {
  const accessToken = getAccessTokenFromLS()
  return !accessToken ? <Outlet /> : <Navigate to={'/manage/dashboard'} />
}

function App() {
  return (
    <>
      <SidebarProvider>
        <Routes>
          <Route element={<RejectedRoute />}>
            <Route element={<PublicLayout />}>
              <Route path={path.login} element={<Login />}></Route>
              <Route path={path.home} element={<Home />}></Route>
            </Route>
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path={path.profile} element={<Profile />}></Route>
              <Route path={path.manageSetting} element={<Setting />}></Route>
              <Route path={path.manageAccounts} element={<Accounts />}></Route>
              <Route path={path.manageDishes} element={<DishesPage />}></Route>
              <Route path={path.manageTables} element={<TablesPage />}></Route>
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </SidebarProvider>
    </>
  )
}

export default App
