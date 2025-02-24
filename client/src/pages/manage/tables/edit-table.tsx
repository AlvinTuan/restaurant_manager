import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TableStatus, TableStatusValues } from '@/constants/type'
import { getTableLink, getVietnameseTableStatus, handleErrorApi } from '@/lib/utils'
import { useAppDispatch } from '@/redux/hook'
import { getTableDetail } from '@/redux/slice/tablesSlice'
import { TableResType, UpdateTableBody, UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm, UseFormSetError } from 'react-hook-form'
import { Link } from 'react-router'

export default function EditTable({
  id,
  setId,
  handleUpdateTable
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  handleUpdateTable: (id: number, values: UpdateTableBodyType, formError?: UseFormSetError<any>) => void
}) {
  const [table, setTable] = useState<TableResType['data'] | null>(null)
  const dispatch = useAppDispatch()
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false
    }
  })
  const tableNumber = 0

  useEffect(() => {
    if (id) {
      dispatch(getTableDetail(id))
        .unwrap()
        .then((res) => {
          setTable(res.data)
        })
        .catch((error) => {
          handleErrorApi({ error, setError: form.setError })
        })
    }
  }, [dispatch, form.setError, id])

  useEffect(() => {
    if (table) {
      form.reset({
        capacity: table.capacity,
        status: table.status,
        changeToken: form.getValues('changeToken')
      })
    }
  }, [dispatch, form, table])

  const onEditTable = (values: UpdateTableBodyType) => {
    handleUpdateTable(id!, values, form.setError)
    setId(undefined)
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined)
        }
      }}
    >
      <DialogContent
        className='sm:max-w-[600px] max-h-screen overflow-auto'
        onCloseAutoFocus={() => {
          form.reset()
          setId(undefined)
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn số {table?.number}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid items-start gap-4 auto-rows-max md:gap-8'
            id='edit-table-form'
            onSubmit={form.handleSubmit(onEditTable)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='capacity'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='price'>Sức chứa (người)</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='capacity' className='w-full' {...field} type='number' />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='description'>Trạng thái</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn trạng thái' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='changeToken'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='price'>Đổi QR Code</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <div className='flex items-center space-x-2'>
                          <Switch id='changeToken' checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                  <Label>QR Code</Label>
                  <div className='w-full col-span-3 space-y-2'></div>
                </div>
              </FormItem>
              <FormItem>
                <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                  <Label>URL gọi món</Label>
                  <div className='w-full col-span-3 space-y-2'>
                    <Link
                      to={getTableLink({
                        token: '123123123',
                        tableNumber: tableNumber
                      })}
                      target='_blank'
                      className='break-all'
                    >
                      {getTableLink({
                        token: '123123123',
                        tableNumber: tableNumber
                      })}
                    </Link>
                  </div>
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-table-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
