import { ModeToggle } from '@/components/mode-toggle'
import DropdownAvatar from '@/layouts/main-layout/header/dropdown-avatar'

export default function Header() {
  return (
    <header className='sticky top-0 z-30 flex items-center gap-4 pr-4 border-b h-14 bg-background sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:pr-6'>
      {/* <MobileNavLinks /> */}

      <div className='relative flex-1 ml-auto md:grow-0'>
        <div className='flex justify-end'>
          <ModeToggle />
        </div>
      </div>
      <DropdownAvatar />
    </header>
  )
}
