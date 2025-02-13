import { path } from '@/constants/path'
import { LoginResType } from '@/schemaValidations/auth.schema'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/utils/auth'
import axios, { AxiosError, AxiosInstance } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum HttpStatus {
  ENTITY_ERROR_STATUS = 422
}

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

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
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
        if (url === path.login) {
          this.accessToken = (response.data as LoginResType).data.accessToken
          this.refreshToken = (response.data as LoginResType).data.refreshToken
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
        } else {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.status === HttpStatus.ENTITY_ERROR_STATUS) {
          console.log('error', error)
          return Promise.reject(
            new EntityError({
              status: 422,
              payload: error.response?.data as EntityErrorPayload
            })
          )
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
