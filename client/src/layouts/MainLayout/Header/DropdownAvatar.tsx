import accountApi from '@/apiRequests/account.api'
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
import { logout } from '@/pages/login/authSlice'
import { useAppDispatch } from '@/redux/hook'
import { AccountResType } from '@/schemaValidations/account.schema'
import { getRefreshTokenFromLS } from '@/utils/auth'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

export default function DropdownAvatar() {
  const [account, setAccount] = useState<AccountResType['data'] | null>(null)
  const dispatch = useAppDispatch()
  const refresh_token = getRefreshTokenFromLS()

  const handleLogout = (refreshToken: string) => {
    dispatch(
      logout({
        refreshToken
      })
    )
  }
  useEffect(() => {
    const controller = new AbortController()
    async function fetchData() {
      const res = await accountApi.me({ signal: controller.signal })
      setAccount(res.data.data)
    }

    fetchData()
    return () => {
      controller.abort()
    }
  }, [])
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
        <DropdownMenuItem onClick={() => handleLogout(refresh_token)}>Đăng xuất</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
