import http, { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN } from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType
} from '@/schemaValidations/auth.schema'

const authApi = {
  loginRequest(body: LoginBodyType) {
    return http.post<LoginResType>(URL_LOGIN, body)
  },
  logoutRequest(body: LogoutBodyType) {
    return http.post(URL_LOGOUT, body)
  },
  refreshTokenRequest(body: RefreshTokenBodyType) {
    return http.post<RefreshTokenResType>(URL_REFRESH_TOKEN, body)
  }
}

export default authApi
