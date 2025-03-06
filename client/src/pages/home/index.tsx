import { formatCurrency } from '@/lib/utils'
import { useGetDishesQuery } from '@/services/dishes.service'

export default function Home() {
  const { data: getDishesRes } = useGetDishesQuery()
  const dishes = getDishesRes?.data
  return (
    <div className='w-full space-y-4'>
      <div className='relative'>
        <span className='absolute top-0 left-0 z-10 w-full h-full bg-black opacity-50'></span>
        <div className='h-[400px] w-[200px] absolute top-0 left-0 object-cover'>
          <img src='/banner.png' alt='Banner' className='w-full h-full bg-no-repeat bg-cover' />
        </div>
        <div className='relative z-20 px-4 py-10 md:py-20 sm:px-10 md:px-20'>
          <h1 className='text-xl font-bold text-center sm:text-2xl md:text-4xl lg:text-5xl'>Nhà hàng Big Boy</h1>
          <p className='mt-4 text-sm text-center sm:text-base'>Vị ngon, trọn khoảnh khắc</p>
        </div>
      </div>
      <section className='py-16 space-y-10'>
        <h2 className='text-2xl font-bold text-center'>Đa dạng các món ăn</h2>
        <div className='grid grid-cols-1 gap-10 sm:grid-cols-2'>
          {dishes &&
            dishes.map((dish, index) => (
              <div className='flex gap-4 w' key={index}>
                <div className='flex-shrink-0'>
                  <img src={dish.image} className='object-cover w-[150px] h-[150px] rounded-md' />
                </div>
                <div className='space-y-1'>
                  <h3 className='text-xl font-semibold'>{dish.name}</h3>
                  <p className=''>{dish.description}</p>
                  <p className='font-semibold'>{formatCurrency(dish.price)}</p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
