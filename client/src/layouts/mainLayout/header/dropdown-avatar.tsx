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
import { useAppSelector } from '@/redux/hook'
import { Link, useLocation, useNavigate } from 'react-router'

export default function DropdownAvatar() {
  const refreshToken = getRefreshTokenFromLS()
  const navigate = useNavigate()
  const location = useLocation()

  const { account } = useAppSelector((state) => state.account)
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
            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
            <AvatarFallback>{account?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
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
