import { Role } from '@/constants/type'
import { useAppContext } from '@/context/app-provider'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { checkAndRefreshToken, decodeToken, isTokenExpired } from '@/lib/utils'
import { useLogoutMutation } from '@/pages/login/auth.service'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const managePaths = ['/manage']
const guestPath = ['/guest']
const privatePaths = [...managePaths, ...guestPath]
const onlyOwnerPaths = ['/manage/accounts']
const unAuthPaths = ['/login']

export default function AuthRoute() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const refreshToken = getRefreshTokenFromLS()
  const [logoutMutation] = useLogoutMutation()
  const { socket, setRole, disconnectSocket } = useAppContext()
  // const [isDialogVisible, setDialogVisible] = useState(false)

  useEffect(() => {
    const decodeRefreshToken = decodeToken(refreshToken)
    const isAccessTokenExp = isTokenExpired(decodeRefreshToken)
    const role = decodeRefreshToken && (decodeRefreshToken.role as string)
    //1.1. Chưa đăng nhập thì không cho vào private paths
    if (!refreshToken && privatePaths.some((path) => pathname.startsWith(path))) {
      navigate('/login', { state: { from: pathname } })
    }

    // 1.2. đăng nhập thì không cho vào login
    if (refreshToken && unAuthPaths.some((path) => pathname.startsWith(path))) {
      navigate('/manage/dashboard', { state: { from: pathname } })
    }

    // // 1.3. lâu ngày không vào
    // - còn hạn access token -> cho vào
    // - hết hạn access token && còn hạn refresh token --> refresh
    // - hết hạn access token && hết hạn refresh token --> logout
    if (privatePaths.some((path) => pathname.startsWith(path)) && isAccessTokenExp && refreshToken) {
      console.log('refresh token het han')
      setRole()
      // setDialogVisible(true)
    }

    // 2. Vào không đúng route, redireact về tranh chủ
    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPath.some((path) => pathname.startsWith(path))
    // Không phải Owner nhưng cố tình truy cập vào các route dành cho owner
    const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some((path) => pathname.startsWith(path))
    if (isNotOwnerGoToOwnerPath || isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      navigate('/', { state: { from: pathname } })
    }
  }, [navigate, pathname, refreshToken, setRole])

  useEffect(() => {
    if (unAuthPaths.includes(pathname)) return
    let interval: any = null

    const onRefreshToken = (force?: boolean) => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          navigate('/login')
        },
        force
      })
    }

    onRefreshToken()
    const TIME_OUT = 60 * 60 * 1000
    interval = setInterval(onRefreshToken, TIME_OUT)
    socket?.connect()
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true)
    }
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)
    socket?.on('refresh-token', onRefreshTokenSocket)
    return () => {
      clearInterval(interval)
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('refresh-token', onRefreshTokenSocket)
    }
  }, [navigate, pathname, socket])

  return (
    <>
      <Outlet />
    </>
  )
}
