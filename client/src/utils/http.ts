import { getAccessTokenFromLS } from '@/utils/auth'
import axios, { AxiosInstance } from 'axios'
class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'http://localhost:4000/',
      timeout: 10000
    })
    // Add a request interceptor
    this.instance.interceptors.request.use(
      function (config) {
        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )

    // Add a response interceptor
    this.instance.interceptors.response.use(
      function (response) {
        return response
      },
      function (error) {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
