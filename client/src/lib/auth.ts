import { LoginResType } from '@/schemaValidations/auth.schema'

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const getAccessTokenFromLS = () => localStorage.getItem('accessToken') ?? ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken') ?? ''

export const setAccountToLS = (account: LoginResType['data']['account']) => {
  localStorage.setItem('account', JSON.stringify(account))
}

export const getAccountToLS = () => {
  const result = localStorage.getItem('account')
  return result ? JSON.parse(result) : null
}

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('account')
}
