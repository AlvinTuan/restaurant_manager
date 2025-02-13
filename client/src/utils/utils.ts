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
