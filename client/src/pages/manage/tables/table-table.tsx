import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
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

import AutoPagination from '@/components/auto-pagination'
import QRCodeTable from '@/components/qrcode-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import AddTable from '@/pages/manage/tables/add-table'
import EditTable from '@/pages/manage/tables/edit-table'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { addTable, deleteTable, getTables, updateTable } from '@/redux/slice/tablesSlice'
import { CreateTableBodyType, TableListResType, UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { createContext, useContext, useEffect, useState } from 'react'
import { UseFormSetError } from 'react-hook-form'
import { useSearchParams } from 'react-router'

type TableItem = TableListResType['data'][0]

const TableTableContext = createContext<{
  setTableIdEdit: (value: number) => void
  tableIdEdit: number | undefined
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
}>({
  setTableIdEdit: (value: number | undefined) => {},
  tableIdEdit: undefined,
  tableDelete: null,
  setTableDelete: (value: TableItem | null) => {}
})

export const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: 'number',
    header: 'Số bàn',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('number')}</div>,
    filterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return false
      return String(row.getValue('number')) === String(filterValue)
    }
  },
  {
    accessorKey: 'capacity',
    header: 'Sức chứa',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('capacity')}</div>
  },
  {
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue('status'))}</div>
  },
  {
    accessorKey: 'token',
    header: 'QR Code',
    cell: ({ row }) => (
      <div>
        <QRCodeTable token={row.getValue('token')} tableNumber={row.getValue('number')}></QRCodeTable>
      </div>
    )
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setTableIdEdit, setTableDelete } = useContext(TableTableContext)
      const openEditTable = () => {
        setTableIdEdit(row.original.number)
      }

      const openDeleteTable = () => {
        setTableDelete(row.original)
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='w-8 h-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteTable({
  tableDelete,
  setTableDelete,
  handleDeleteTable
}: {
  tableDelete: TableItem | null
  setTableDelete: (value: TableItem | null) => void
  handleDeleteTable: (id: number) => void
}) {
  const onDelete = () => {
    handleDeleteTable(tableDelete!.number)
    setTableDelete(null)
  }

  return (
    <AlertDialog
      open={Boolean(tableDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setTableDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa bàn ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Bàn <span className='px-1 rounded bg-foreground text-primary-foreground'>{tableDelete?.number}</span> sẽ bị
            xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function TableTable() {
  const [searchParam] = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [tableIdEdit, setTableIdEdit] = useState<number | undefined>()
  const [tableDelete, setTableDelete] = useState<TableItem | null>(null)
  const dispatch = useAppDispatch()
  const { tables } = useAppSelector((state) => state.tables)
  const data: any[] = tables
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
    pageSize: PAGE_SIZE //default page size
  })
  const { toast } = useToast()

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
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  useEffect(() => {
    dispatch(getTables())
      .unwrap()
      .catch((err) => handleErrorApi(err))
  }, [dispatch])

  /**
   * Add new table
   * @param values
   */
  const handleAddTable = (values: CreateTableBodyType) => {
    dispatch(addTable(values))
      .unwrap()
      .then((res) => {
        toast({
          description: res.message
        })
      })
      .catch((error) => {
        handleErrorApi({ error })
      })
  }

  /**
   * Update table
   * @param values
   */
  const handleUpdateTable = (id: number, values: UpdateTableBodyType, formError?: UseFormSetError<any>) => {
    dispatch(updateTable({ id, body: values }))
      .unwrap()
      .then((res) => {
        toast({ description: res.message })
      })
      .catch((error) => {
        handleErrorApi({ error, setError: formError })
      })
  }

  /**
   * Delete table
   */
  const handleDeleteTable = (id: number) => {
    dispatch(deleteTable(id))
      .unwrap()
      .then((res) => {
        toast({ description: res.message })
      })
      .catch((error) => {
        handleErrorApi({ error })
      })
  }

  return (
    <TableTableContext.Provider value={{ tableIdEdit, setTableIdEdit, tableDelete, setTableDelete }}>
      <div className='w-full'>
        <EditTable id={tableIdEdit} setId={setTableIdEdit} handleUpdateTable={handleUpdateTable} />
        <AlertDialogDeleteTable
          tableDelete={tableDelete}
          setTableDelete={setTableDelete}
          handleDeleteTable={handleDeleteTable}
        />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Lọc số bàn'
            value={(table.getColumn('number')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('number')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='flex items-center gap-2 ml-auto'>
            <AddTable handleAddTable={handleAddTable} />
          </div>
        </div>
        <div className='border rounded-md'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong> trong <strong>{data.length}</strong>{' '}
            kết quả
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname='/manage/tables'
            />
          </div>
        </div>
      </div>
    </TableTableContext.Provider>
  )
}
