import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Role } from '@/constants/type'
import { ShoppingCart, Table } from 'lucide-react'

const menuGuest = [
  {
    title: 'Menu',
    Icon: Table,
    href: '/guest/menu',
    roles: [Role.Guest]
  },
  {
    title: 'Đơn hàng của bạn',
    Icon: ShoppingCart,
    href: '/guest/orders',
    roles: [Role.Guest]
  }
]

export function NavMainGuest() {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarMenu>
        {menuGuest.map((item) => (
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
