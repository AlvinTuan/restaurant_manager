import { AppSidebar } from '@/components/app-sidebar'
import { path } from '@/constants/path'
import { useAppContext } from '@/context/app-provider'
import Header from '@/layouts/main-layout/header'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/pages/login/auth.service'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

export default function MainLayout() {
  const { pathname } = useLocation()
  const [logoutMutation] = useLogoutMutation()
  const { setRole, socket, disconnectSocket } = useAppContext()
  const refreshToken = getRefreshTokenFromLS()
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) {
      console.log('Socket chưa được khởi tạo')
      return
    }
    if (pathname === path.login) return
    function onLogout() {
      try {
        logoutMutation(refreshToken)
        setRole()
        disconnectSocket()
        navigate(path.home)
      } catch (error: any) {
        handleErrorApi({
          error
        })
      }
    }
    socket?.on('logout', onLogout)
    return () => {
      socket?.off('logout', onLogout)
    }
  }, [socket, pathname, setRole, disconnectSocket, logoutMutation, refreshToken, navigate])
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
