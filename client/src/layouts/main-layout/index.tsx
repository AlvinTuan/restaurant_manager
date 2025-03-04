import { AppSidebar } from '@/components/app-sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { path } from '@/constants/path'
import { useAppContext } from '@/context/app-provider'
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear justify-between group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-4'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='h-4 mr-2' />
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href='#'>Building Your Application</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
            </div>
            <ModeToggle />
          </header>
          <Outlet></Outlet>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
