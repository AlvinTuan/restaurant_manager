import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DishTable from '@/pages/manage/dishes/dish-table'
import { Suspense } from 'react'

export default function DishesPage() {
  return (
    <main className='grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Món ăn</CardTitle>
            <CardDescription>Quản lý món ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <DishTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
