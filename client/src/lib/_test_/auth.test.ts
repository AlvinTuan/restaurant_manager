import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setRefreshTokenToLS
} from '@/lib/auth'
import { describe, expect, test } from 'vitest'

const ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJPd25lciIsInRva2VuVHlwZSI6IkFjY2Vzc1Rva2VuIiwiaWF0IjoxNzQxODc4MzEyLCJleHAiOjE3NDE5MjE1MTJ9.7SQaQBJCCTuMyvf2EQ764M_JU9T4ROalSMCHX0XVpE0'

const REFRESH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJPd25lciIsInRva2VuVHlwZSI6IlJlZnJlc2hUb2tlbiIsImlhdCI6MTc0MTg3ODMxMiwiZXhwIjoxNzQxOTY0NzEyfQ.OopSA5jrY9ENSMxPvpRrSMYkfs7cZcUvRwTNSzg7Qu8'

describe('test access token', () => {
  test('refresh token setter/getter local storage', () => {
    setAccessTokenToLS(ACCESS_TOKEN)
    expect(getAccessTokenFromLS()).toBe(ACCESS_TOKEN)
  })
})

describe('test refresh token', () => {
  test('refresh token setter/getter local storage', () => {
    setRefreshTokenToLS(REFRESH_TOKEN)
    expect(getRefreshTokenFromLS()).toBe(REFRESH_TOKEN)
  })
})

describe('test remove', () => {
  test('remove local storage', () => {
    setAccessTokenToLS(ACCESS_TOKEN)
    setRefreshTokenToLS(REFRESH_TOKEN)
    clearLS()
    expect(getAccessTokenFromLS()).toBeFalsy()
    expect(getRefreshTokenFromLS()).toBeFalsy()
  })
})
