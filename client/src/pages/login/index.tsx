import LoginForm from '@/pages/login/components/login-form'
import { useAppSelector } from '@/redux/hook'
import { Suspense, useEffect } from 'react'
import { useNavigate } from 'react-router'

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
      <div className='max-w-[350px] w-full mx-auto'>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </>
  )
}
