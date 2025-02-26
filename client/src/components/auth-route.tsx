import { getRefreshTokenFromLS } from '@/lib/auth'
import { checkAndRefreshToken, decodeToken, isTokenExpired } from '@/lib/utils'
import { setRole } from '@/pages/login/auth.slice'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const privatePaths = ['/manage/dashboard']
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
    //1.1. Chưa đăng nhập thì không cho vào private paths
    if (!refreshToken && privatePaths.some((path) => pathname.startsWith(path))) {
      navigate('/login', { state: { from: pathname } })
    }

    // 1.2. đăng nhập thì không cho vào login
    if (refreshToken && unAuthPaths.some((path) => pathname.startsWith(path))) {
      navigate('/manage/dashboard', { state: { from: pathname } })
    }

    // // 1.3. lâu ngày không vào thì refresh_token hết hạn
    if (privatePaths.some((path) => pathname.startsWith(path)) && isAccessTokenExp && refreshToken) {
      console.log('refresh token het han')
      dispatch(setRole())
      // setDialogVisible(true)
    }
  }, [dispatch, isAuth, navigate, pathname, refreshToken])

  useEffect(() => {
    if (unAuthPaths.includes(pathname)) return
    let interval: any = null
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval)
        // navigate('/login')
      }
    })
    const TIME_OUT = 1000
    interval = setInterval(() => {
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval)
          // navigate('/login')
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
