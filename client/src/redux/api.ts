import http from '@/lib/http'
import { BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { AxiosError, AxiosRequestConfig } from 'axios'

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method?: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await http({
        url,
        method,
        data,
        params,
        headers
      })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      console.log(err)
      return {
        error: {
          status: err.status,
          payload: (err as any).payload
        }
      }
    }
  }
