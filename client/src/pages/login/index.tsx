import LoginForm from '@/pages/login/components/login-form'
import { useAppSelector } from '@/redux/hook'
import { Suspense } from 'react'
import { useNavigate } from 'react-router'

export default function Login() {
  const auth = useAppSelector((state) => state.auth)
  const navigate = useNavigate()
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
