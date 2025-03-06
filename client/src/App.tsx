import AuthRoute from '@/components/auth-route'
import { Toaster } from '@/components/ui/toaster'
import { path } from '@/constants/path'
import GuestLayout from '@/layouts/guest-layout'
import ManageLayout from '@/layouts/manage-layout'
import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, Route, Routes } from 'react-router'

// lazy loading page
const Login = lazy(() => import('@/pages/login'))
const TableOrder = lazy(() => import('@/pages/guest'))
const GuestMenuOrder2 = lazy(() => import('@/pages/guest/menu/guest-menu-order'))
const GuestOrder = lazy(() => import('@/pages/guest/orders'))
const Accounts = lazy(() => import('@/pages/manage/accounts'))
const DashboardPage = lazy(() => import('@/pages/manage/dashboard'))
const DishesPage = lazy(() => import('@/pages/manage/dishes'))
const ManageOrderPage = lazy(() => import('@/pages/manage/orders'))
const TablesPage = lazy(() => import('@/pages/manage/tables'))
const Setting = lazy(() => import('@/pages/manage/setting'))
const NotFound = lazy(() => import('@/pages/not-found'))

const LazyElement = ({ Component, title }: { Component: React.ElementType; title?: string }) => {
  return (
    <Suspense>
      {title && (
        <Helmet>
          <title>PointSell Restaurant | {`${title}`}</title>
        </Helmet>
      )}
      <Component />
    </Suspense>
  )
}

const manageRoutes = [
  { path: path.manageDashboard, element: DashboardPage, title: 'Dashboard' },
  { path: path.manageSetting, element: Setting, title: 'Cập nhật tài khoản' },
  { path: path.manageAccounts, element: Accounts, title: 'Quản lý nhân viên' },
  { path: path.manageDishes, element: DishesPage, title: 'Quản lý món ăn' },
  { path: path.manageTables, element: TablesPage, title: 'Quản lý bàn ăn' },
  { path: path.manageOrders, element: ManageOrderPage, title: 'Quản lý đơn hàng' }
]

const guestRoutes = [
  { path: path.guestMenu, element: GuestMenuOrder2, title: 'Gọi món' },
  { path: path.guestOrder, element: GuestOrder, title: 'Trạng thái đơn hàng' }
]

function App() {
  return (
    <>
      <Routes>
        {/* redirect root path */}
        <Route path='/' element={<Navigate to={path.login} />} />

        {/* public route */}
        <Route path={path.login} element={<LazyElement Component={Login} />}></Route>
        <Route path={path.guestLogin} element={<LazyElement Component={TableOrder} />} />

        {/* Protected Route */}
        <Route element={<AuthRoute />}>
          <Route element={<ManageLayout />}>
            {manageRoutes.map(({ path, element, title }) => (
              <Route key={path} path={path} element={<LazyElement title={title} Component={element} />}></Route>
            ))}
          </Route>
          <Route element={<GuestLayout />}>
            {guestRoutes.map(({ path, element, title }) => (
              <Route key={path} path={path} element={<LazyElement title={title} Component={element} />} />
            ))}
          </Route>
        </Route>

        {/* 404 Page */}
        <Route path='*' element={<LazyElement Component={NotFound} />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
