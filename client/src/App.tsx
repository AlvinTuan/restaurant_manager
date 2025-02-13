import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { path } from '@/constants/path'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Profile from '@/pages/profile'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <>
      <SidebarProvider>
        <Routes>
          <Route path={path.login} element={<Login />}></Route>
          <Route element={<MainLayout />}>
            <Route path={path.home} element={<Home />}></Route>
            <Route path={path.profile} element={<Profile />}></Route>
          </Route>
        </Routes>
        <Toaster />
      </SidebarProvider>
    </>
  )
}

export default App
