import { axiosBaseQuery } from '@/redux/api'
import { LoginBodyType, LoginResType } from '@/schemaValidations/auth.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    login: build.mutation<LoginResType, LoginBodyType>({
      query(body) {
        return {
          url: 'auth/login',
          method: 'post',
          data: body
        }
      }
    }),
    logout: build.mutation({
      query(body) {
        return {
          url: 'auth/logout',
          method: 'post',
          data: body
        }
      }
    })
  })
})

export const { useLoginMutation, useLogoutMutation } = authApi
