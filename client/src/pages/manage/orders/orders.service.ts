import { axiosBaseQuery } from '@/redux/api'
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

const ordersApi = createApi({
  reducerPath: 'ordersApi',
  tagTypes: ['Orders'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getOrderList: build.query<GetOrdersResType, void>({
      query() {
        return {
          url: 'orders',
          method: 'get'
        }
      },
      providesTags: (result, _error, _arg) =>
        result ? [...result.data.map(({ id }) => ({ type: 'Orders' as const, id })), 'Orders'] : ['Orders']
    }),
    updateOrder: build.mutation<UpdateOrderResType, { id: number; body: UpdateOrderBodyType }>({
      query({ id, body }) {
        return {
          url: `orders/${id}`,
          method: 'put',
          data: body
        }
      },
      invalidatesTags: (_result, _error, arg) => [{ type: 'Orders', id: arg.id }]
    })
  })
})
