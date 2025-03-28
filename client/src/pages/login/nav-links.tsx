import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { RoleType } from '@/constants/jwt.types'
import { Role } from '@/constants/type'
import { useAppContext } from '@/context/app-provider'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/pages/login/auth.service'
import { useAppSelector } from '@/redux/hook'
import { Link } from 'react-router'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogged?: boolean
}[] = [
  {
    title: 'Trang chủ',
    href: '/'
  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogged: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee]
  }
]

export default function NavLinks({ className }: { className?: string }) {
  const { role } = useAppSelector((state) => state.auth)
  const [logoutMutaion] = useLogoutMutation()
  const { setRole, disconnectSocket } = useAppContext()

  const logout = () => {
    try {
      const refreshToken = getRefreshTokenFromLS()

      logoutMutaion({ refreshToken })
      setRole()
      disconnectSocket()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <>
      {menuItems.map((item) => {
        const isAuth = item.role && role && item.role.includes(role)
        const canShow = (item.role === undefined && !item.hideWhenLogged) || (!role && item.hideWhenLogged)
        if (isAuth || canShow) {
          return (
            <Link to={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, 'cursor-pointer')}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có muốn đăng xuất không?</AlertDialogTitle>
              <AlertDialogDescription>Việc đăng xuất có thể làm mất đi hóa đơn của bạn</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Thoát</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}
