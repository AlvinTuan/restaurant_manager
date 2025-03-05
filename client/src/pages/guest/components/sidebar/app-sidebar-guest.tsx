import { GalleryVerticalEnd } from 'lucide-react'
import * as React from 'react'

import { SidebarLogo } from '@/components/sidebar-logo'
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavMainGuest } from '@/pages/guest/components/sidebar/nav-main-guest'

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

export function AppSidebarGuest({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarLogo teams={data.logo} />
      </SidebarHeader>
      <SidebarContent>
        <NavMainGuest />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
