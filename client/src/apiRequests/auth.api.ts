import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import http from '@/utils/http'

const authApi = {
  loginRequest(body: LoginBodyType) {
    return http.post<LoginResType>('auth/login', body)
  },
  logoutRequest(body: LogoutBodyType) {
    return http.post('auth/logout', body)
  }
}

export default authApi
