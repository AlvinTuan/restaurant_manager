import AutoPagination from '@/components/auto-pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, getVietnameseDishStatus, simpleMatchText } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { useGetDishesQuery } from '@/services/dishes.service'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'

type DishItem = DishListResType['data'][0]

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<DishItem>[] = [
  {
    id: 'dishName',
    header: 'Món ăn',
    cell: ({ row }) => (
      <div className='flex items-center space-x-4'>
        <img src={row.original.image} alt={row.original.name} className='rounded-md object-cover w-[50px] h-[50px]' />
        <span>{row.original.name}</span>
      </div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true
      return simpleMatchText(String(row.getValue(columnId)), String(filterValue))
    }
  },
  {
    accessorKey: 'price',
    header: 'Giá cả',
    cell: ({ row }) => <div className='capitalize'>{formatCurrency(row.getValue('price'))}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <div>{getVietnameseDishStatus(row.getValue('status'))}</div>
  }
]

const PAGE_SIZE = 10
export function DishesDialog({ onChoose }: { onChoose: (dish: DishItem) => void }) {
  const [open, setOpen] = useState(false)
  const { data: getDishListRes } = useGetDishesQuery()
  const data = getDishListRes?.data ?? []
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  useEffect(() => {
    table.setPagination({
      pageIndex: 0,
      pageSize: PAGE_SIZE
    })
  }, [table])

  const choose = (dish: DishItem) => {
    onChoose(dish)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-full overflow-auto'>
        <DialogHeader>
          <DialogTitle>Chọn món ăn</DialogTitle>
        </DialogHeader>
        <div>
          <div className='w-full'>
            <div className='flex items-center py-4'>
              <Input
                placeholder='Lọc tên'
                value={(table.getColumn('dishName')?.getFilterValue() as string) ?? ''}
                onChange={(event) => table.getColumn('dishName')?.setFilterValue(event.target.value)}
                className='max-w-sm'
              />
            </div>
            <div className='border rounded-md'>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        onClick={() => choose(row.original)}
                        className='cursor-pointer'
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className='flex items-center justify-end py-4 space-x-2'>
              <div className='flex-1 py-4 text-xs text-muted-foreground '>
                Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong{' '}
                <strong>{data.length}</strong> kết quả
              </div>
              <div>
                <AutoPagination
                  page={table.getState().pagination.pageIndex + 1}
                  pageSize={table.getPageCount()}
                  onClick={(pageNumber) =>
                    table.setPagination({
                      pageIndex: pageNumber - 1,
                      pageSize: PAGE_SIZE
                    })
                  }
                  isLink={false}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
