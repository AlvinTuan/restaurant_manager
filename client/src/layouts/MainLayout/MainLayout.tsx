import { AppSidebar } from '@/components/app-sidebar'
import { path } from '@/constants/path'
import { Role } from '@/constants/type'
import Header from '@/layouts/MainLayout/Header/Header'
import { useAppSelector } from '@/redux/hook'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const UNAUTHORIZED_ROUTES = ['/login']

export default function MainLayout() {
  const auth = useAppSelector((state) => state.auth)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (UNAUTHORIZED_ROUTES.includes(pathname)) {
      return
    }

    if (!auth?.isLoggedIn) {
      console.log('navigate to /login from ', pathname)
      navigate('/login', { state: { from: pathname } })
      return
    }

    if (pathname === path.login && auth.isLoggedIn) {
      if (auth.account?.role === Role.Owner || auth.account?.role === Role.Employee) {
        console.log('Layout: Switch to home')
        navigate('/', { state: { from: pathname } })
      }
    }
  }, [auth, navigate, pathname])

  return (
    <>
      <AppSidebar></AppSidebar>

      <div className='flex flex-col w-full min-h-screen bg-muted/40'>
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:px-8'>
          <Header></Header>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  )
}
