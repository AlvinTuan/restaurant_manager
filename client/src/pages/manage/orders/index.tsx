import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import OrderTable from '@/pages/manage/orders/order-table'

import { Suspense } from 'react'

export default function OrdersPage() {
  return (
    <main className='grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
            <CardDescription>Quản lý đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <OrderTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
