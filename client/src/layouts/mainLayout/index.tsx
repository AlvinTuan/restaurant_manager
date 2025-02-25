import { AppSidebar } from '@/components/app-sidebar'
import Header from '@/layouts/mainLayout/header'
import { Outlet } from 'react-router'

export default function MainLayout() {
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
