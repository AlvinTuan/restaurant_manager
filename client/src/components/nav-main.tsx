import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import menuItems from '@/constants/menuItem'

export function NavMain() {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.href}>
                <item.Icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
