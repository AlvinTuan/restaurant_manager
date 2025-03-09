import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import menuItems from '@/constants/menuItem'
import { useAppContext } from '@/context/app-provider'

export function NavMain() {
  const { role } = useAppContext()
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarMenu>
        {menuItems.map((item) => {
          if (!item.roles.includes(role as 'Owner' | 'Employee')) return
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.href}>
                  <item.Icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
