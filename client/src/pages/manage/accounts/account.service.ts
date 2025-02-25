import { axiosBaseQuery } from '@/redux/api'
import {
  AccountListResType,
  AccountResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType
} from '@/schemaValidations/account.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const accountApi = createApi({
  reducerPath: 'accountApi',
  tagTypes: ['Account', 'Employee'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getMe: build.query<AccountResType, void>({
      query() {
        return {
          url: '/accounts/me',
          method: 'get'
        }
      }
    }),
    getEmployees: build.query<AccountListResType, void>({
      query() {
        return {
          url: 'accounts',
          method: 'get'
        }
      },
      providesTags: (result, error, arg) =>
        result ? [...result.data.map(({ id }) => ({ type: 'Employee' as const, id })), 'Employee'] : ['Employee']
    }),
    getEmployee: build.query<AccountResType, number>({
      query(id) {
        return {
          url: `accounts/detail/${id}`,
          method: 'get'
        }
      }
    }),
    addEmployee: build.mutation<AccountResType, CreateEmployeeAccountBodyType>({
      query(body) {
        return {
          url: 'accounts',
          method: 'post',
          data: body
        }
      },
      invalidatesTags: ['Employee']
    }),
    editEmployee: build.mutation<AccountResType, { id: number; body: UpdateEmployeeAccountBodyType }>({
      query({ id, body }) {
        return {
          url: `accounts/detail/${id}`,
          method: 'put',
          data: body
        }
      },
      invalidatesTags: (_result, _error, arg) => [{ type: 'Employee', id: arg.id }]
    }),
    deleteEmployee: build.mutation<AccountResType, number>({
      query(id) {
        return {
          url: `accounts/detail/${id}`,
          method: 'delete'
        }
      },
      invalidatesTags: (_result, _error, arg) => [{ type: 'Employee', id: arg }]
    })
  })
})

export const {
  useGetEmployeesQuery,
  useAddEmployeeMutation,
  useEditEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeeQuery,
  useGetMeQuery
} = accountApi
