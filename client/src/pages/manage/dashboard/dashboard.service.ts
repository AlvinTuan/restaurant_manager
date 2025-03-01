import { axiosBaseQuery } from '@/redux/api'
import { DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  tagTypes: ['Dashboard'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    getDashboardIndicator: build.query<DashboardIndicatorResType, { fromDate: string; toDate: string }>({
      query({ fromDate, toDate }) {
        return {
          url: '/indicators/dashboard',
          method: 'get',
          params: {
            fromDate,
            toDate
          }
        }
      }
    })
  })
})

export const { useGetDashboardIndicatorQuery } = dashboardApi
