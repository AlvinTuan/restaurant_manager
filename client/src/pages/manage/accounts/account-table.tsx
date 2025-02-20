/* eslint-disable react-refresh/only-export-components */
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
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

import { Button } from '@/components/ui/button'

import AutoPagination from '@/components/auto-pagination'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import AddEmployee from '@/pages/manage/accounts/add-employee'
import EditEmployee from '@/pages/manage/accounts/edit-employee'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { deleteEmployee, getAccountList, startEditEmployee } from '@/redux/slice/accountSlice'
import { AccountListResType, AccountType } from '@/schemaValidations/account.schema'
import { handleErrorApi } from '@/utils/utils'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

type AccountItem = AccountListResType['data'][0]

const AccountTableContext = createContext<{
  setEmployeeIdEdit: (value: number) => void
  employeeIdEdit: number | undefined
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem | null) => void
}>({
  setEmployeeIdEdit: (_value: number | undefined) => {},
  employeeIdEdit: undefined,
  employeeDelete: null,
  setEmployeeDelete: (_value: AccountItem | null) => {}
})

export const columns: ColumnDef<AccountType>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <div>
        <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
          <AvatarImage src={row.getValue('avatar')} />
          <AvatarFallback className='rounded-none'>{row.original.name}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: 'name',
    header: 'Tên',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className='w-4 h-4 ml-2' />
        </Button>
      )
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEmployeeIdEdit, setEmployeeDelete } = useContext(AccountTableContext)
      const dispatch = useAppDispatch()
      const openEditEmployee = () => {
        setEmployeeIdEdit(row.original.id)
        dispatch(startEditEmployee(row.original.id))
      }

      const openDeleteEmployee = () => {
        setEmployeeDelete(row.original)
      }
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='w-8 h-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditEmployee}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteEmployee}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]

function AlertDialogDeleteAccount({
  employeeDelete,
  setEmployeeDelete
}: {
  employeeDelete: AccountItem | null
  setEmployeeDelete: (value: AccountItem | null) => void
}) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const deleteAccount = async () => {
    if (employeeDelete) {
      try {
        console.log('delete')
        await dispatch(deleteEmployee(employeeDelete.id))
          .unwrap()
          .then((res) => {
            toast({
              description: res.message
            })
          })
        setEmployeeDelete(null)
      } catch (error) {
        handleErrorApi({ error })
      }
    }
  }
  return (
    <AlertDialog
      open={Boolean(employeeDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setEmployeeDelete(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa nhân viên?</AlertDialogTitle>
          <AlertDialogDescription>
            Tài khoản <span className='px-1 rounded bg-foreground text-primary-foreground'>{employeeDelete?.name}</span>{' '}
            sẽ bị xóa vĩnh viễn
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteAccount}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
// Số lượng item trên 1 trang
const PAGE_SIZE = 10
export default function AccountTable() {
  const [searchParam] = useSearchParams()
  const page = searchParam.get('page') ? Number(searchParam.get('page')) : 1
  const pageIndex = page - 1
  // const params = Object.fromEntries(searchParam.entries())
  const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>()
  const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(null)
  const dispatch = useAppDispatch()
  const { employeeList } = useAppSelector((state) => state.account)
  const data: any[] = employeeList
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex, // Gía trị mặc định ban đầu, không có ý nghĩa khi data được fetch bất đồng bộ
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
    dispatch(getAccountList())
      .unwrap()
      .catch((error) => {
        handleErrorApi({ error })
      })
  }, [dispatch])

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE
    })
  }, [table, pageIndex])

  return (
    <AccountTableContext.Provider value={{ employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete }}>
      <div className='w-full'>
        <EditEmployee id={employeeIdEdit} setId={setEmployeeIdEdit} />
        <AlertDialogDeleteAccount employeeDelete={employeeDelete} setEmployeeDelete={setEmployeeDelete} />
        <div className='flex items-center py-4'>
          <Input
            placeholder='Filter emails...'
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <div className='flex items-center gap-2 ml-auto'>
            <AddEmployee />
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
              pathname='/manage/accounts'
            />
          </div>
        </div>
      </div>
    </AccountTableContext.Provider>
  )
}
