import AuthRoute from '@/components/auth-route'
import Loading from '@/components/loading'
import { path } from '@/constants/path'
import GuestLayout from '@/layouts/guest-layout'
import ManageLayout from '@/layouts/manage-layout'
import { lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet-async'
import { Navigate, useRoutes } from 'react-router'

// Lazy loading pages
const Login = lazy(() => import('@/pages/login'))
const TableOrder = lazy(() => import('@/pages/guest'))
const GuestMenuOrder = lazy(() => import('@/pages/guest/menu'))
const GuestOrder = lazy(() => import('@/pages/guest/orders'))
const Accounts = lazy(() => import('@/pages/manage/accounts'))
const DashboardPage = lazy(() => import('@/pages/manage/dashboard'))
const DishesPage = lazy(() => import('@/pages/manage/dishes'))
const ManageOrderPage = lazy(() => import('@/pages/manage/orders'))
const TablesPage = lazy(() => import('@/pages/manage/tables'))
const Setting = lazy(() => import('@/pages/manage/setting'))
const NotFound = lazy(() => import('@/pages/not-found'))

// eslint-disable-next-line react-refresh/only-export-components
const LazyElement = ({ Component, title }: { Component: React.ElementType; title?: string }) => {
  return (
    <>
      {title && (
        <Helmet>
          <title>{`PointSell Restaurant | ${title}`}</title>
        </Helmet>
      )}
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </>
  )
}

export function useRouteElement() {
  return useRoutes([
    { path: '/', element: <Navigate to={path.login} /> },
    { path: path.login, element: <LazyElement Component={Login} /> },
    { path: path.guestLogin, element: <LazyElement Component={TableOrder} /> },
    {
      element: <AuthRoute />,
      children: [
        {
          element: <ManageLayout />,
          children: [
            { path: path.manageDashboard, element: <LazyElement title='Dashboard' Component={DashboardPage} /> },
            { path: path.manageSetting, element: <LazyElement title='Cập nhật tài khoản' Component={Setting} /> },
            { path: path.manageAccounts, element: <LazyElement title='Quản lý nhân viên' Component={Accounts} /> },
            { path: path.manageDishes, element: <LazyElement title='Quản lý món ăn' Component={DishesPage} /> },
            { path: path.manageTables, element: <LazyElement title='Quản lý bàn ăn' Component={TablesPage} /> },
            { path: path.manageOrders, element: <LazyElement title='Quản lý đơn hàng' Component={ManageOrderPage} /> }
          ]
        },
        {
          element: <GuestLayout />,
          children: [
            { path: path.guestMenu, element: <LazyElement title='Gọi món' Component={GuestMenuOrder} /> },
            { path: path.guestOrder, element: <LazyElement title='Trạng thái đơn hàng' Component={GuestOrder} /> }
          ]
        }
      ]
    },
    { path: '*', element: <LazyElement Component={NotFound} /> }
  ])
}
