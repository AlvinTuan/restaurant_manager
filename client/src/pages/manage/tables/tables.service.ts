import { axiosBaseQuery } from '@/redux/api'
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from '@/schemaValidations/table.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const tablesApi = createApi({
  reducerPath: 'tablesApi',
  tagTypes: ['Tables'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getTables: build.query<TableListResType, void>({
      query() {
        return {
          url: 'tables',
          method: 'get'
        }
      },
      providesTags: (result, _error, _arg) =>
        result ? [...result.data.map(({ number }) => ({ type: 'Tables' as const, number })), 'Tables'] : ['Tables']
    }),
    getTable: build.query<TableResType, number>({
      query(id) {
        return {
          url: `tables/${id}`,
          method: 'get'
        }
      }
    }),
    addTable: build.mutation<TableResType, CreateTableBodyType>({
      query(body) {
        return {
          url: 'tables',
          method: 'post',
          data: body
        }
      },
      invalidatesTags: ['Tables']
    }),
    editTable: build.mutation<TableResType, { id: number; body: UpdateTableBodyType }>({
      query({ id, body }) {
        return {
          url: `tables/${id}`,
          method: 'put',
          data: body
        }
      },
      invalidatesTags: (_result, _error, arg, _meta) => [{ type: 'Tables', id: arg.id }]
    }),
    deleteTable: build.mutation<TableResType, number>({
      query(id) {
        return {
          url: `tables/${id}`,
          method: 'delete'
        }
      },
      invalidatesTags: (_result, _error, arg, _meta) => [{ type: 'Tables', id: arg }]
    })
  })
})

export const {
  useAddTableMutation,
  useDeleteTableMutation,
  useEditTableMutation,
  useGetTableQuery,
  useGetTablesQuery
} = tablesApi
