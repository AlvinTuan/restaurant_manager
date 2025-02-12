import { path } from '@/constants/path'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import http from '@/utils/http'

const authApi = {
  loginRequest(body: LoginBodyType) {
    return http.post<LoginResType>(path.login, body)
  },
  logoutRequest(body: LogoutBodyType) {
    return http.post(path.logout, body)
  }
}

export default authApi
