import { Link } from 'react-router'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu'
  },
  {
    title: 'Đơn hàng',
    href: '/orders'
  },
  {
    title: 'Đăng nhập',
    href: '/login'
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard'
  }
]

export default function NavItems({ className }: { className?: string }) {
  return menuItems.map((item) => {
    return (
      <Link to={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
