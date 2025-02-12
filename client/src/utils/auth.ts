import { LoginResType } from '@/schemaValidations/auth.schema'

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem('refresh_token', refresh_token)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') ?? ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') ?? ''

export const setAccountToLS = (account: LoginResType['data']['account']) => {
  localStorage.setItem('account', JSON.stringify(account))
}

export const getAccountToLS = () => {
  const result = localStorage.getItem('account')
  return result ? JSON.parse(result) : null
}

export const LocalStorageEventTarget = new EventTarget()
export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('account')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}
