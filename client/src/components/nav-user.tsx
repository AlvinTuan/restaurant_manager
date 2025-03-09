import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { path } from '@/constants/path'
import { useAppContext } from '@/context/app-provider'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/pages/login/auth.service'
import { useGetMeQuery } from '@/services/account.service'
import { Link, useNavigate } from 'react-router'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { data: getMeRes } = useGetMeQuery()
  const user = getMeRes && getMeRes.data

  const [logout] = useLogoutMutation()
  const { setRole, disconnectSocket } = useAppContext()
  const navigate = useNavigate()
  const refreshToken = getRefreshTokenFromLS()

  const onLogout = async (refreshToken: string) => {
    try {
      await logout({ refreshToken }).unwrap()
      setRole()
      disconnectSocket()
      navigate(path.login, { state: { from: location.pathname } })
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='w-8 h-8 rounded-lg'>
                <AvatarImage src={user?.avatar ?? ''} alt={user?.name} />
                <AvatarFallback className='rounded-lg'>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-sm leading-tight text-left'>
                <span className='font-semibold truncate'>{user?.name}</span>
                <span className='text-xs truncate'>{user?.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='w-8 h-8 rounded-lg'>
                  <AvatarImage src={user?.avatar ?? undefined} alt={user?.name} />
                  <AvatarFallback className='rounded-lg'>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-sm leading-tight text-left'>
                  <span className='font-semibold truncate'>{user?.name}</span>
                  <span className='text-xs truncate'>{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link to={path.manageSetting}>
                  <div className='flex items-center gap-2'>
                    <BadgeCheck />
                    <span>Account setting</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLogout(refreshToken)}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
