import { Role } from '@/constants/type'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { checkAndRefreshToken, decodeToken, isTokenExpired } from '@/lib/utils'
import { setRole } from '@/pages/login/auth.slice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const managePaths = ['/manage']
const guestPath = ['/guest']
const privatePaths = [...managePaths, ...guestPath]
const unAuthPaths = ['/login']

export default function AuthRoute() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { isAuth } = useAppSelector((state) => state.auth)
  const refreshToken = getRefreshTokenFromLS()
  const dispatch = useAppDispatch()
  const [isDialogVisible, setDialogVisible] = useState(false)

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
      dispatch(setRole())
      // setDialogVisible(true)
    }

    // 2. Vào không đúng route, redireact về tranh chủ
    const isGuestGoToManagePath = role === Role.Guest && managePaths.some((path) => pathname.startsWith(path))
    const isNotGuestGoToGuestPath = role !== Role.Guest && guestPath.some((path) => pathname.startsWith(path))
    if (isGuestGoToManagePath || isNotGuestGoToGuestPath) {
      navigate('/', { state: { from: pathname } })
    }
  }, [dispatch, isAuth, navigate, pathname, refreshToken])

  useEffect(() => {
    if (unAuthPaths.includes(pathname)) return
    let interval: any = null
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
        navigate('/login')
      }
    })
    const TIME_OUT = 60 * 60 * 1000
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          navigate('/login')
        }
      })
    }, TIME_OUT)
    return () => {
      clearInterval(interval)
    }
  }, [navigate, pathname])
  return (
    <>
      <Outlet />
      {/* <DialogExpried isDialogVisible={isDialogVisible} onClose={() => setDialogVisible(false)}></DialogExpried> */}
    </>
  )
}
