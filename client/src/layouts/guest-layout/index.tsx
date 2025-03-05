import { ModeToggle } from '@/components/mode-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebarGuest } from '@/pages/guest/components/sidebar/app-sidebar-guest'
import { Outlet } from 'react-router'

export default function GuestLayout() {
  return (
    <SidebarProvider>
      <AppSidebarGuest />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear justify-between group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 p-4'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='h-4 mr-2' />
            {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href='#'>Building Your Application</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
          </div>
          <ModeToggle />
        </header>
        <Outlet></Outlet>
      </SidebarInset>
    </SidebarProvider>
  )
}
