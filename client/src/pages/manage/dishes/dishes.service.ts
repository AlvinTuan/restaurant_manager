import { axiosBaseQuery } from '@/redux/api'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const dishesApi = createApi({
  reducerPath: 'dishesApi',
  tagTypes: ['Dishes'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getDishes: build.query<DishListResType, void>({
      query() {
        return {
          url: 'dishes',
          method: 'get'
        }
      },
      providesTags: (result, _error, _arg) =>
        result ? [...result.data.map(({ id }) => ({ type: 'Dishes' as const, id })), 'Dishes'] : ['Dishes']
    }),
    getDish: build.query<DishResType, number>({
      query(id) {
        return {
          url: `dishes/${id}`,
          method: 'get'
        }
      }
    }),
    addDish: build.mutation<DishResType, CreateDishBodyType>({
      query(body) {
        return {
          url: 'dishes',
          method: 'post',
          data: body
        }
      },
      invalidatesTags: ['Dishes']
    }),
    editDish: build.mutation<DishResType, { id: number; body: UpdateDishBodyType }>({
      query({ id, body }) {
        return {
          url: `dishes/${id}`,
          method: 'put',
          data: body
        }
      },
      invalidatesTags: (_result, _error, arg, _meta) => [{ type: 'Dishes', id: arg.id }]
    }),
    deleteDish: build.mutation<DishResType, number>({
      query(id) {
        return {
          url: `dishes/${id}`,
          method: 'delete'
        }
      },
      invalidatesTags: (_result, _error, arg, _meta) => [{ type: 'Dishes', id: arg }]
    })
  })
})

export const { useGetDishesQuery, useAddDishMutation, useDeleteDishMutation, useEditDishMutation, useGetDishQuery } =
  dishesApi
