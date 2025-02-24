import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/lib/auth'
import { LoginResType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import axios, { AxiosError, AxiosInstance } from 'axios'

enum HttpStatus {
  ENTITY_ERROR_STATUS = 422,
  UNAUTHORIZED_ERROR_STATUS = 401
}

export const URL_LOGIN = 'auth/login'
export const URL_LOGOUT = 'auth/logout'
export const URL_REFRESH_TOKEN = '/auth/refresh-token'

type EntityErrorPayload = {
  message: string
  errors: {
    field: string
    message: string
  }[]
}

export class HttpError extends Error {
  status: number
  payload: {
    message: string
    [key: string]: any
  }
  constructor({ status, payload, message = 'Lỗi HTTP' }: { status: number; payload: any; message?: string }) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

export class EntityError extends HttpError {
  status: typeof HttpStatus.ENTITY_ERROR_STATUS
  payload: EntityErrorPayload
  constructor({ status, payload }: { status: typeof HttpStatus.ENTITY_ERROR_STATUS; payload: EntityErrorPayload }) {
    super({ status, payload, message: 'Lỗi thực thể' })
    this.status = status
    this.payload = payload
  }
}

export class UnAuthorizedError extends HttpError {
  status: typeof HttpStatus.UNAUTHORIZED_ERROR_STATUS
  payload: { message: string }
  constructor({
    status,
    payload
  }: {
    status: typeof HttpStatus.UNAUTHORIZED_ERROR_STATUS
    payload: { message: string }
  }) {
    super({ status, payload, message: 'Unauthorized Response' })
    this.status = status
    this.payload = payload
  }
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/',
      timeout: 10000
    })
    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN) {
          this.accessToken = (response.data as LoginResType).data.accessToken
          this.refreshToken = (response.data as LoginResType).data.refreshToken
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // chỉ log lỗi không phải 422 và 401
        if (
          ![HttpStatus.ENTITY_ERROR_STATUS, HttpStatus.UNAUTHORIZED_ERROR_STATUS].includes(
            error.response?.status as number
          )
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          console.log(message)
        }

        if (error.status === HttpStatus.ENTITY_ERROR_STATUS) {
          console.log('error', error)
          return Promise.reject(
            new EntityError({
              status: 422,
              payload: error.response?.data as EntityErrorPayload
            })
          )
          // lỗi Unauthorized (401) có rất nhiều trường hợp
          // - token không đúng
          // - không truyền token
          // - token hết hạn*

          // nếu là lỗi 401
        } else if (error.status === HttpStatus.UNAUTHORIZED_ERROR_STATUS) {
          // console.log('401 error -->', error)
          const config = error.response!.config
          const { url } = config
          // trường hợp Token hết hạn và request đó không phải là của request refresh token
          // thì mới tiến hành gọi refresh-token

          console.log('config -->', config)
          if (url !== URL_REFRESH_TOKEN) {
            // hạn chế gọi 2 lần handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // xủ lý resolve 1 access token hết hạn
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest
              .then((accessToken) => {
                return this.instance({
                  ...config,
                  headers: {
                    ...config.headers,
                    Authorization: accessToken
                  }
                }) // gọi lại API bị lỗi
              })
              .catch((refreshTokenError) => {
                throw refreshTokenError
              })
          }
          // còn những trường hợp như token không đúng, không truyền token, token hết hạn
          // nhưng gọi refresh token bị fail (refresh-token hết hạn) thì tiến hành xoá local storage và toast message

          return Promise.reject(
            new UnAuthorizedError({
              status: 401,
              payload: error.response?.data as UnAuthorizedError
            })
          )
        }
        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken = () => {
    return this.instance
      .post<RefreshTokenResType>(URL_REFRESH_TOKEN, { refreshToken: this.refreshToken })
      .then((res) => {
        const { accessToken } = res.data.data
        setAccessTokenToLS(accessToken)
        this.accessToken = accessToken
        return accessToken
      })
      .catch((err) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        console.log(err)
        throw err
      })
  }
}

const http = new Http().instance
export default http
