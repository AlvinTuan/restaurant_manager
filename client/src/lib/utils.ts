/* eslint-disable @typescript-eslint/no-unused-expressions */
import authApi from '@/apiRequests/auth.api'
import { DishStatus, TableStatus } from '@/constants/type'
import { toast } from '@/hooks/use-toast'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/lib/auth'
import { isEntityError } from '@/lib/helpers'
import { clsx, type ClassValue } from 'clsx'
import { jwtDecode } from 'jwt-decode'
import type { UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  // console.log(isEntityError(error), error)
  if (isEntityError(error) && setError) {
    error.payload.errors.forEach((element) => {
      console.log(element.field)
      setError(element.field, {
        type: 'server',
        message: element.message
      })
    })
  } else {
    toast({
      variant: 'destructive',
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      duration: duration ?? 2000
    })
  }
}

export const getVietnameseDishStatus = (status: 'Available' | 'Unavailable' | 'Hidden') => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseTableStatus = (status: 'Available' | 'Reserved' | 'Hidden') => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return 'http://localhost:3000' + '/table-order/' + tableNumber + '?token=' + token
}

export const decodeToken = (token: string | null) => (token ? jwtDecode(token) : null)

export const isTokenExpired = (decodedToken: any | null) => {
  if (!decodedToken || !decodedToken.exp) {
    return true
  }
  const now = Math.round(Date.now() / 1000)
  return decodedToken.exp - now <= 0
}

export const checkAndRefreshToken = async (param?: { onError?: () => void; onSuccess?: () => void }) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()
  if (!accessToken || !refreshToken) return
  const decodedAccessToken = decodeToken(accessToken)
  const decodedRefreshToken = decodeToken(refreshToken)
  const now = Math.round(new Date().getTime() / 1000)
  if (decodedRefreshToken && decodedRefreshToken.exp! <= now) {
    clearLS()
    return param?.onError && param.onError()
  }
  if (decodedAccessToken && decodedAccessToken.exp! - now < (decodedAccessToken.exp! - decodedAccessToken.iat!) / 3) {
    // Gọi API refresh token
    try {
      const res = await authApi.refreshTokenRequest({ refreshToken })
      setAccessTokenToLS(res.data.data.accessToken)
      setRefreshTokenToLS(res.data.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      console.log(error)
      param?.onError && param.onError()
    }
  }
}
