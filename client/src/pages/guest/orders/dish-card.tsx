import { Badge } from '@/components/ui/badge'
import { useAppContext } from '@/context/app-provider'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, getVietnameseOrderStatus } from '@/lib/utils'
import { PayGuestOrdersResType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import { useGetOrderOfGuestQuery } from '@/services/guest.service'
import { useEffect } from 'react'

export default function DishCard() {
  const { data: ordersRes, refetch } = useGetOrderOfGuestQuery()
  const orders = ordersRes?.data ?? []
  const { socket } = useAppContext()
  const { toast } = useToast()
  const totalPrice = orders.reduce((sum, order) => {
    return sum + order.dishSnapshot.price * order.quantity
  }, 0)

  useEffect(() => {
    if (socket?.connected) {
      onConnect()
    }

    function onConnect() {
      console.log(socket?.id)
    }

    function onDisconnect() {
      console.log('disconnect')
    }

    function onUpdateOrder(data: UpdateOrderResType['data']) {
      const {
        dishSnapshot: { name },
        quantity
      } = data
      toast({
        description: `Món ${name} (SL: ${quantity}) vừa được cập nhật sang trạng thái "${getVietnameseOrderStatus(
          data.status
        )}"`
      })
      refetch()
    }

    function onPayment(data: PayGuestOrdersResType['data']) {
      const { guest } = data[0]
      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn`
      })
      refetch()
    }

    socket?.on('update-order', onUpdateOrder)
    socket?.on('payment', onPayment)
    socket?.on('connect', onConnect)
    socket?.on('disconnect', onDisconnect)

    return () => {
      socket?.off('connect', onConnect)
      socket?.off('disconnect', onDisconnect)
      socket?.off('update-order', onUpdateOrder)
      socket?.off('payment', onPayment)
    }
  }, [refetch, socket, toast])

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className='flex gap-4 [&:not(:last-child)]:mb-4'>
          <div className='text-sm font-semibold'>{index + 1}</div>
          <div className='relative flex-shrink-0'>
            <img
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              className='object-cover w-[80px] h-[80px] rounded-md'
            />
          </div>
          <div className='space-y-1'>
            <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
            <div className='text-xs font-semibold'>
              {formatCurrency(order.dishSnapshot.price)} x <Badge className='px-1'>{order.quantity}</Badge>
            </div>
          </div>
          <div className='flex items-center justify-center flex-shrink-0 ml-auto'>
            <Badge variant={'outline'}>{getVietnameseOrderStatus(order.status)}</Badge>
          </div>
        </div>
      ))}
      <div className='mt-10'>
        <div className='flex w-full space-x-4 text-xl font-semibold'>
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  )
}
