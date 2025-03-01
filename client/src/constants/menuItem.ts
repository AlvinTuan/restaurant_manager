import { path } from '@/constants/path'
import { Home, Salad, ShoppingCart, Table, Users2 } from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    Icon: Home,
    href: path.manageDashboard
  },
  {
    title: 'Đơn hàng',
    Icon: ShoppingCart,
    href: path.manageOrders
  },
  {
    title: 'Bàn ăn',
    Icon: Table,
    href: path.manageTables
  },
  {
    title: 'Món ăn',
    Icon: Salad,
    href: path.manageDishes
  },
  {
    title: 'Nhân viên',
    Icon: Users2,
    href: path.manageAccounts
  }
]

export default menuItems
