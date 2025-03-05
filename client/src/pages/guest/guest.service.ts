import { axiosBaseQuery } from '@/redux/api'
import { LogoutBodyType } from '@/schemaValidations/auth.schema'
import { MessageResType } from '@/schemaValidations/common.schema'
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType
} from '@/schemaValidations/guest.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const guestApi = createApi({
  reducerPath: 'guestApi',
  tagTypes: ['Guest'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    loginGuest: build.mutation<GuestLoginResType, GuestLoginBodyType>({
      query(body) {
        return {
          url: 'guest/auth/login',
          method: 'post',
          data: body
        }
      }
    }),
    logoutGuest: build.mutation<MessageResType, LogoutBodyType>({
      query(body) {
        return {
          url: 'guest/auth/logout',
          method: 'post',
          data: body
        }
      }
    }),
    orderOfGuest: build.mutation<GuestCreateOrdersResType, GuestCreateOrdersBodyType>({
      query(body) {
        return {
          url: 'guest/orders',
          method: 'post',
          data: body
        }
      },
      invalidatesTags: ['Guest']
    }),
    getOrderOfGuest: build.query<GuestGetOrdersResType, void>({
      query() {
        return {
          url: 'guest/orders',
          method: 'get'
        }
      },
      providesTags: ['Guest']
    })
  })
})

export const { useLoginGuestMutation, useLogoutGuestMutation, useGetOrderOfGuestQuery, useOrderOfGuestMutation } =
  guestApi
