import { Button } from '@/components/ui/button'
import { DishStatus } from '@/constants/type'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import { useOrderOfGuestMutation } from '@/pages/guest/guest.service'
import Quantity from '@/pages/guest/menu/quantity'
import { useGetDishesQuery } from '@/pages/manage/dishes/dishes.service'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function GuestMenuOrder() {
  const { data: dishesRes } = useGetDishesQuery()
  const dishes = dishesRes?.data ?? []
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const [createOrdersQuery] = useOrderOfGuestMutation()
  const { toast } = useToast()
  const navigate = useNavigate()

  // value
  const totalPrice = orders.reduce((sum, order) => {
    const dish = dishes.find((dish) => dish.id === order.dishId)
    if (!dish) return sum
    return sum + order.quantity * dish.price
  }, 0)

  // 1 món là 1 order
  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      // nếu số lượng là 0 thì không thêm vào ds order
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      // nếu sl > = thì tìm món ở trong orders
      const existingOrderIndex = prevOrders.findIndex((dish) => dish.dishId === dishId)
      // kiếm tra xem đã tồn tại trong order chưa
      // - chưa thì thêm
      if (existingOrderIndex === -1) {
        return [...prevOrders, { dishId, quantity }]
      }
      const newOrders = [...prevOrders]
      newOrders[existingOrderIndex] = { ...prevOrders[existingOrderIndex], quantity }
      return newOrders
    })
  }

  const onOrders = (orders: GuestCreateOrdersBodyType) => {
    try {
      createOrdersQuery(orders)
        .unwrap()
        .then((res) => {
          toast({
            description: res.message
          })
        })
      navigate('/guest/orders')
    } catch (error) {
      handleErrorApi({ error })
    }
  }

  return (
    <div className='max-w-[400px] mx-auto space-y-4'>
      <h1 className='text-xl font-bold text-center'>🍕 Menu quán</h1>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div key={dish.id} className='flex gap-4'>
            <div className='flex-shrink-0'>
              <img src={dish.image} alt={dish.name} className='object-cover w-[80px] h-[80px] rounded-md' />
            </div>
            <div className='space-y-1'>
              <h3 className='text-sm'>{dish.name}</h3>
              <p className='text-xs'>{dish.description}</p>
              <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
            </div>
            <div className='flex items-center justify-center flex-shrink-0 ml-auto'>
              <Quantity
                value={orders.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                onChange={(quantity) => handleQuantityChange(dish.id, quantity)}
              ></Quantity>
            </div>
          </div>
        ))}
      <div className='sticky bottom-0'>
        <Button className='justify-between w-full' onClick={() => onOrders(orders)} disabled={orders.length === 0}>
          <span>Đơn hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </div>
  )
}
