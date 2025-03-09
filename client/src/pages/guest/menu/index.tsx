import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency, handleErrorApi } from '@/lib/utils'
import Quantity from '@/pages/guest/menu/quantity'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGetDishesQuery } from '@/services/dishes.service'
import { useOrderOfGuestMutation } from '@/services/guest.service'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function GuestMenuOrder() {
  const { data: getDishesRes } = useGetDishesQuery()
  const dishes = getDishesRes ? getDishesRes.data : []
  const [menuGuestChoice, setMenuGetChoice] = useState<GuestCreateOrdersBodyType>([])
  const [createOrderMutation] = useOrderOfGuestMutation()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setMenuGetChoice((prevOrders) => {
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

  const totalMenuGuestChoice = menuGuestChoice.reduce((sum, order) => {
    const findDish = dishes.find((dish) => dish.id === order.dishId)
    if (!findDish) return sum
    return sum + findDish.price * order.quantity
  }, 0)

  const onChoice = (dishId: number) => {
    handleQuantityChange(dishId, 1)
  }

  const onOrders = (orders: GuestCreateOrdersBodyType) => {
    try {
      createOrderMutation(orders)
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
    <div className='flex flex-col flex-1 gap-4 p-4 pt-0'>
      <div className='flex flex-col h-full gap-4 lg:flex-row'>
        <div className='border rounded-lg basis-full lg:basis-2/3'>
          <div className='grid grid-cols-1 gap-4 p-4 overflow-y-auto lg:grid-cols-3 sm:grid-cols-2'>
            {dishes.map((dish) => (
              <div key={dish.id} className='h-[300px] p-2 border rounded-lg dish flex flex-col'>
                <img src={dish.image} alt={dish.name} className='object-cover w-full rounded-lg h-1/2' />
                <div className='mt-3 text-lg font-semibold'>{dish.name}</div>
                <div className='text-sm text-gray-500'>{dish.description}</div>
                <div className='flex items-center justify-between mt-2'>
                  <div>{formatCurrency(dish.price)}</div>
                  <Button variant='secondary' onClick={() => onChoice(dish.id)}>
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* desktop */}
        <div className='hidden h-full p-2 border rounded-lg md:relative order-menu-desktop lg:block md:basis-1/3'>
          {dishes
            .filter((dish) => menuGuestChoice.map((order) => order.dishId).includes(dish.id))
            .map((dish) => (
              <>
                <div key={dish.id} className='w-full flex gap-4 [&:not(:last-child)]:mb-2 [&:not(:first-child)]:mt-2'>
                  <div className='flex-shrink-0'>
                    <img src={dish.image} alt={dish.name} className='object-cover w-[80px] h-[80px] rounded-md' />
                  </div>
                  <div className='flex flex-col flex-1 xl:flex-row'>
                    <div className='space-y-1'>
                      <h3 className='text-sm'>{dish.name}</h3>
                      <p className='text-xs'>{dish.description}</p>
                      <p className='text-xs font-semibold'>{formatCurrency(dish.price)}</p>
                    </div>
                    <div className='flex items-center justify-center flex-shrink-0 ml-auto'>
                      <Quantity
                        value={menuGuestChoice.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                        onChange={(quantity) => handleQuantityChange(dish.id, quantity)}
                      ></Quantity>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            ))}
          <div className='absolute bottom-0 left-0 right-0 p-2'>
            <Button className='w-full' disabled={menuGuestChoice.length === 0}>
              <span>Đơn hàng · {menuGuestChoice.length} món</span>
              <span>{formatCurrency(totalMenuGuestChoice)}</span>
            </Button>
          </div>
        </div>
        {/* mobile */}
        <div className='block w-full lg:hidden'>
          <Drawer>
            <DrawerTrigger asChild>
              <Button className='w-full' disabled={menuGuestChoice.length === 0}>
                <span>Đơn hàng · {menuGuestChoice.length} món</span>
                <span>{formatCurrency(totalMenuGuestChoice)}</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className='text-center'>Giỏ hàng</DrawerTitle>
              </DrawerHeader>
              <div className='p-2'>
                {dishes
                  .filter((dish) => menuGuestChoice.map((order) => order.dishId).includes(dish.id))
                  .map((dish) => (
                    <>
                      <div key={dish.id} className='flex gap-4 [&:not(:last-child)]:mb-2 [&:not(:first-child)]:mt-2'>
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
                            value={menuGuestChoice.find((order) => order.dishId === dish.id)?.quantity ?? 0}
                            onChange={(quantity) => handleQuantityChange(dish.id, quantity)}
                          ></Quantity>
                        </div>
                      </div>
                      <Separator />
                    </>
                  ))}
              </div>

              <DrawerFooter>
                <Button
                  className='w-full'
                  disabled={menuGuestChoice.length === 0}
                  onClick={() => onOrders(menuGuestChoice)}
                >
                  <span>Đơn hàng · {menuGuestChoice.length} món</span>
                  <span>{formatCurrency(totalMenuGuestChoice)}</span>
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  )
}
