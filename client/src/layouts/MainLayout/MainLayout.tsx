import { useAppSelector } from '@/redux/hook'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const unAuthorizatedRoutes = ['/login']

export default function MainLayout() {
  const auth = useAppSelector((state) => state.auth)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (!unAuthorizatedRoutes.includes(pathname)) {
      console.log('---> MainLayout.Effect', auth, pathname)

      if (auth == undefined || !auth.isLoggedIn) {
        console.log('navigate to /login from ', pathname)
        navigate('/login', { state: { from: pathname } })
      }
      if (auth.isLoggedIn) {
        console.log('EPRLayout: Switch to home')
        navigate('/', { state: { from: pathname } })
        return
      }
    }
  }, [auth, navigate, pathname])
  return (
    <>
      <header>Header</header>
      <Outlet></Outlet>
    </>
  )
}
