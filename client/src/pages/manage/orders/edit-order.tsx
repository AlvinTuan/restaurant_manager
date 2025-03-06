import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OrderStatus, OrderStatusValues } from '@/constants/type'
import { useToast } from '@/hooks/use-toast'
import { getVietnameseOrderStatus, handleErrorApi } from '@/lib/utils'
import { DishesDialog } from '@/pages/manage/orders/dishes-dialog'
import { DishListResType } from '@/schemaValidations/dish.schema'
import { UpdateOrderBody, UpdateOrderBodyType } from '@/schemaValidations/order.schema'
import { useGetOrderDetailQuery, useUpdateOrderMutation } from '@/services/orders.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess
}: {
  id?: number | undefined
  setId: (value: number | undefined) => void
  onSubmitSuccess?: () => void
}) {
  const [updateOrderMutation] = useUpdateOrderMutation()
  const { data: getOrderDetailRes } = useGetOrderDetailQuery(id!, { skip: !id })
  const [selectedDish, setSelectedDish] = useState<DishListResType['data'][0] | null>()
  const { toast } = useToast()
  const data = getOrderDetailRes?.data || null
  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1
    }
  })

  useEffect(() => {
    if (data) {
      const {
        status,
        dishSnapshot: { dishId },
        quantity
      } = data
      form.reset({
        status,
        dishId: dishId ?? 0,
        quantity
      })
      setSelectedDish(data.dishSnapshot)
    }
  }, [data, form])

  const reset = () => {
    setId(undefined)
  }
  const onSubmit = async (values: UpdateOrderBodyType) => {
    try {
      updateOrderMutation({ id: id as number, body: values })
        .unwrap()
        .then((res) => toast({ description: res.message }))

      reset()
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onSubmitSuccess && onSubmitSuccess()
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset()
        }
      }}
    >
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid items-start gap-4 auto-rows-max md:gap-8'
            id='edit-order-form'
            onSubmit={form.handleSubmit(onSubmit, console.log)}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='dishId'
                render={({ field }) => (
                  <FormItem className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                    <FormLabel>Món ăn</FormLabel>
                    <div className='flex items-center col-span-2 space-x-4'>
                      <Avatar className='aspect-square w-[50px] h-[50px] rounded-md object-cover'>
                        <AvatarImage src={selectedDish?.image} />
                        <AvatarFallback className='rounded-none'>{selectedDish?.name}</AvatarFallback>
                      </Avatar>
                      <div>{selectedDish?.name}</div>
                    </div>

                    <DishesDialog
                      onChoose={(dish) => {
                        field.onChange(dish.id)
                        setSelectedDish(dish)
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid items-center grid-cols-4 gap-4 justify-items-start'>
                      <Label htmlFor='quantity'>Số lượng</Label>
                      <div className='w-full col-span-3 space-y-2'>
                        <Input
                          id='quantity'
                          inputMode='numeric'
                          pattern='[0-9]*'
                          className='w-16 text-center'
                          {...field}
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value
                            const numberValue = Number(value)
                            if (isNaN(numberValue)) {
                              return
                            }
                            field.onChange(numberValue)
                          }}
                        />
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
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl className='col-span-3'>
                          <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Trạng thái' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OrderStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {getVietnameseOrderStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='edit-order-form'>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
