import http from '@/lib/http'
import { RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import { AxiosResponse } from 'axios'

const guestApiRequest = {
  refreshTokenPromise: null as Promise<AxiosResponse<RefreshTokenResType>> | null,
  async refreshTokenRequest(body: RefreshTokenBodyType): Promise<AxiosResponse<RefreshTokenResType>> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }
    this.refreshTokenPromise = http.post<RefreshTokenResType>('/guest/auth/refresh-token', body)
    const res = await this.refreshTokenPromise
    this.refreshTokenPromise = null
    return res
  }
}

export default guestApiRequest
