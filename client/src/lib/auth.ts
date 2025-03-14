export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const getAccessTokenFromLS = () => localStorage.getItem('accessToken') ?? ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refreshToken') ?? ''

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
