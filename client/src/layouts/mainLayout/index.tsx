import { AppSidebar } from '@/components/app-sidebar'
import Header from '@/layouts/mainLayout/header'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { getMe } from '@/redux/slice/accountSlice'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

export default function MainLayout() {
  const auth = useAppSelector((state) => state.auth)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getMe())
      .unwrap()
      .catch((error) => {
        console.log(error)
      })
  }, [auth, navigate, pathname, dispatch])

  return (
    <>
      <AppSidebar></AppSidebar>

      <div className='flex flex-col w-full min-h-screen bg-muted/40'>
        <div className='flex flex-col sm:gap-4 sm:py-4 sm:px-8'>
          <Header></Header>
          <Outlet></Outlet>
        </div>
      </div>
    </>
  )
}
