import http, { URL_REFRESH_TOKEN } from '@/lib/http'
import { RefreshTokenBodyType, RefreshTokenResType } from '@/schemaValidations/auth.schema'
import { AxiosResponse } from 'axios'

const authApiRequest = {
  refreshTokenPromise: null as Promise<AxiosResponse<RefreshTokenResType>> | null,
  async refreshTokenRequest(body: RefreshTokenBodyType): Promise<AxiosResponse<RefreshTokenResType>> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise
    }
    this.refreshTokenPromise = http.post<RefreshTokenResType>(URL_REFRESH_TOKEN, body)
    const res = await this.refreshTokenPromise
    this.refreshTokenPromise = null // Reset promise sau khi gọi xong.
    return res
  }
}

export default authApiRequest
