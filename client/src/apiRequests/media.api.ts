import { UploadImageResType } from '@/schemaValidations/media.schema'
import http from '@/utils/http'

export const mediaRequest = {
  uploadImage: (formData: FormData) => http.post<UploadImageResType>('media/upload', formData)
}
