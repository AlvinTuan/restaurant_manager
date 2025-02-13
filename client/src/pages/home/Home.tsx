import { logout } from '@/pages/login/authSlice'
import { useAppDispatch } from '@/redux/hook'
import { getRefreshTokenFromLS } from '@/utils/auth'

export default function Home() {
  const dispatch = useAppDispatch()
  const refreshToken = getRefreshTokenFromLS()
  const handleLogout = (refreshToken: string) => {
    dispatch(
      logout({
        refreshToken
      })
    )
  }
  return (
    <div>
      Home
      <div onClick={() => handleLogout(refreshToken)}>logout</div>
    </div>
  )
}
