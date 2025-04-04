import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableStatus, TableStatusValues } from '@/constants/type'
import { useToast } from '@/hooks/use-toast'
import { getVietnameseTableStatus } from '@/lib/utils'
import { CreateTableBody, CreateTableBodyType } from '@/schemaValidations/table.schema'
import { useAddTableMutation } from '@/services/tables.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AddTable() {
  const [open, setOpen] = useState(false)
  const [addTableMutation] = useAddTableMutation()
  const { toast } = useToast()
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: {
      number: 0,
      capacity: 2,
      status: TableStatus.Hidden
    }
  })

  const reset = () => {
    form.reset()
  }

  const onAddTable = (values: CreateTableBodyType) => {
    addTableMutation(values)
      .unwrap()
      .then((res) => {
        toast({ description: res.message })
      })
    reset()
    setOpen(false)
  }
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' className='gap-1 h-7'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm bàn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto' onCloseAutoFocus={() => form.reset()}>
        <DialogHeader>
          <DialogTitle>Thêm bàn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid items-start gap-4 auto-rows-max md:gap-8'
            id='add-table-form'
            onSubmit={form.handleSubmit(onAddTable, (e) => console.log(e))}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='number'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='name'>Số hiệu bàn</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input id='number' type='number' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='capacity'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='price'>Lượng khách cho phép</Label>
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-table-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
