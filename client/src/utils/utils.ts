import { DishStatus } from '@/constants/type'
import { toast } from '@/hooks/use-toast'
import { EntityError } from '@/utils/http'
import type { UseFormSetError } from 'react-hook-form'
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
