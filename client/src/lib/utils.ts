import { DishStatus, TableStatus } from '@/constants/type'
import { toast } from '@/hooks/use-toast'
import { EntityError } from '@/lib/http'
import { clsx, type ClassValue } from 'clsx'
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
  if (error instanceof EntityError && setError) {
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
      duration: duration ?? 3000
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
  return 'http://localhost:3000' + '/tables/' + tableNumber + '?token=' + token
}
