import { axiosBaseQuery } from '@/redux/api'
import { UploadImageResType } from '@/schemaValidations/media.schema'
import { createApi } from '@reduxjs/toolkit/query/react'

export const mediaApi = createApi({
  reducerPath: 'mediaApi',
  tagTypes: ['Media'],
  baseQuery: axiosBaseQuery(),
  endpoints: (build) => ({
    uploadImage: build.mutation<UploadImageResType, FormData>({
      query(formData) {
        return {
          url: 'media/upload',
          method: 'post',
          data: formData
        }
      }
    })
  })
})

export const { useUploadImageMutation } = mediaApi
