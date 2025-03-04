/* eslint-disable @typescript-eslint/no-unused-expressions */
import authApiRequest from '@/apiRequests/auth.api'
import guestApiRequest from '@/apiRequests/guest.api'
import { TokenPayload } from '@/constants/jwt.types'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constants/type'
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
import { format } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import type { UseFormSetError } from 'react-hook-form'
import { io } from 'socket.io-client'
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

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
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

export const decodeToken = (token: string | null) => (token ? (jwtDecode(token) as TokenPayload) : null)

export const isTokenExpired = (decodedToken: any | null) => {
  if (!decodedToken || !decodedToken.exp) {
    return true
  }
  const now = Math.round(Date.now() / 1000)
  return decodedToken.exp - now <= 0
}

export const checkAndRefreshToken = async (param?: {
  onError?: () => void
  onSuccess?: () => void
  force?: boolean
}) => {
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
  if (
    param?.force || // buoc phai refresh token
    (decodedAccessToken && decodedAccessToken.exp! - now < (decodedAccessToken.exp! - decodedAccessToken.iat!) / 3)
  ) {
    // Gọi API refresh token
    try {
      const role = decodedRefreshToken?.role
      const res =
        role === Role.Guest
          ? await guestApiRequest.refreshTokenRequest({ refreshToken })
          : await authApiRequest.refreshTokenRequest({ refreshToken })
      setAccessTokenToLS(res.data.data.accessToken)
      setRefreshTokenToLS(res.data.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      console.log(error)
      param?.onError && param.onError()
    }
  }
}

// chuyyễn chữ tiếng việt có dấu thành không dấu
export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const generateSocketInstace = (accessToken: string) => {
  const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000'
  return io(URL, {
    auth: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}
