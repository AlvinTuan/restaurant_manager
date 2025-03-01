import { axiosBaseQuery } from '@/redux/api'
import {
  GetOrderDetailResType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  tagTypes: ['Orders'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getOrderList: build.query<GetOrdersResType, { fromDate: string; toDate: string }>({
      query({ fromDate, toDate }) {
        return {
          url: 'orders',
          method: 'get',
          params: {
            fromDate: fromDate,
            toDate: toDate
          }
        }
      },
      providesTags: (result, _error, _arg) =>
        result ? [...result.data.map(({ id }) => ({ type: 'Orders' as const, id })), 'Orders'] : ['Orders']
    }),
    getOrderDetail: build.query<GetOrderDetailResType, number>({
      query(orderId) {
        return {
          url: `orders/${orderId}`,
          method: 'get'
        }
      }
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
    }),
    payForGuest: build.mutation<PayGuestOrdersResType, PayGuestOrdersBodyType>({
      query(body) {
        return {
          url: 'orders/pay',
          method: 'post',
          data: body
        }
      }
    })
  })
})

export const { useGetOrderListQuery, useUpdateOrderMutation, useGetOrderDetailQuery, usePayForGuestMutation } =
  ordersApi
