import { GalleryVerticalEnd } from 'lucide-react'
import * as React from 'react'

import { NavUser } from '@/components/nav-user'
import { SidebarLogo } from '@/components/sidebar-logo'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'

// This is sample data.
const data = {
  logo: [
    {
      name: 'PointSell',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise'
    }
  ]
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navComponent: React.ReactNode
  isGuest?: boolean
}

export function AppSidebar({ navComponent, isGuest, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarLogo teams={data.logo} />
      </SidebarHeader>
      <SidebarContent>{navComponent}</SidebarContent>
      {!isGuest && (
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
