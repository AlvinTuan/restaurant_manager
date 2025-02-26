import { axiosBaseQuery } from '@/redux/api'
import { GuestLoginBodyType, GuestLoginResType } from '@/schemaValidations/guest.schema'
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
    logoutGuest: build.mutation({
      query(body) {
        return {
          url: 'guest/auth/logout',
          method: 'post',
          data: body
        }
      }
    })
  })
})

export const { useLoginGuestMutation, useLogoutGuestMutation } = guestApi
