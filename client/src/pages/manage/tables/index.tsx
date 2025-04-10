import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TableTable from '@/pages/manage/tables/table-table'

export default function TablesPage() {
  return (
    <main className='grid items-start flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Bàn ăn</CardTitle>
            <CardDescription>Quản lý bàn ăn</CardDescription>
          </CardHeader>
          <CardContent>
            <TableTable />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
