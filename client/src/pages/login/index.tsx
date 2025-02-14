import { ModeToggle } from '@/components/mode-toggle'
import LoginForm from '@/pages/login/components/login-form'
import NavItems from '@/pages/login/nav-items'
import { useAppSelector } from '@/redux/hook'
import { Package2 } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'

export default function Login() {
  const auth = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
  // const location = useLocation()
  // const from = location.state.pathname ?? '/'
  useEffect(() => {
    if (auth.isLoggedIn) {
      navigate('/')
      return
    }
  }, [auth, navigate])

  // const handleLoginSuccess = () => {
  //   navigate(from) // Quay về trang gốc hoặc '/' nếu không có from
  // }
  return (
    <>
      <div className='relative flex flex-col w-full min-h-screen'>
        <header className='sticky top-0 flex items-center h-16 gap-4 px-4 border-b bg-background md:px-6'>
          <nav className='flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
            <Link to='#' className='flex items-center gap-2 text-lg font-semibold md:text-base'>
              <Package2 className='w-6 h-6' />
              <span className='sr-only'>Big boy</span>
            </Link>
            <NavItems className='flex-shrink-0 transition-colors text-muted-foreground hover:text-foreground' />
          </nav>
          <div className='ml-auto'>
            <ModeToggle />
          </div>
        </header>
        <main className='flex items-center justify-center'>
          <div className='max-w-[350px] w-full top-1/2 translate-y-1/2'>
            <LoginForm />
          </div>
        </main>
      </div>
    </>
  )
}
