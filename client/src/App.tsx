import { Toaster } from '@/components/ui/toaster'
import MainLayout from '@/layouts/MainLayout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Profile from '@/pages/profile'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />}></Route>
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
