import { path } from '@/constants/path'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { useAppDispatch } from '@/redux/hook'
import { logout } from '@/redux/slice/authSlice'
import { Link } from 'react-router'

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
      <br />
      <Link to={path.profile}>Quản lý</Link>
      <div onClick={() => handleLogout(refreshToken)}>logout</div>
    </div>
  )
}
