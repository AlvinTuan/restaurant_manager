import { ModeToggle } from '@/components/mode-toggle'
import LoginForm from '@/pages/login/LoginForm'
import NavItems from '@/pages/login/NavItems'
import { Package2 } from 'lucide-react'
import { Link } from 'react-router'

export default function Login() {
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
        <main className='flex flex-col items-center flex-1 gap-4 p-4 md:gap-8 md:p-8'>
          <div className='max-w-[350px] w-full'>
            <LoginForm />
          </div>
        </main>
      </div>
    </>
  )
}
