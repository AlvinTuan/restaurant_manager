import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { path } from '@/constants/path'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/pages/login/auth.service'
import { useGetMeQuery } from '@/pages/manage/accounts/account.service'
import { Link, useLocation, useNavigate } from 'react-router'

export default function DropdownAvatar() {
  const refreshToken = getRefreshTokenFromLS()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: getAccountRes, isFetching } = useGetMeQuery()

  const [logout] = useLogoutMutation()

  const onLogout = async (refreshToken: string) => {
    try {
      await logout({ refreshToken }).unwrap()
      navigate(path.login, { state: { from: location.pathname } })
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <Avatar>
            <AvatarImage src={getAccountRes?.data?.avatar ?? undefined} alt={getAccountRes?.data?.name} />
            <AvatarFallback>{getAccountRes?.data?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{getAccountRes?.data?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={'/manage/setting'} className='cursor-pointer'>
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onLogout(refreshToken)}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
