import { LoginBodyType, LoginResType } from '@/schemaValidations/auth.schema'
import http from '@/utils/http'

const authApi = {
  loginRequest(body: LoginBodyType, options?: { signal?: AbortSignal }) {
    return http.post<LoginResType>('auth/login', body, options)
  }
}

export default authApi
