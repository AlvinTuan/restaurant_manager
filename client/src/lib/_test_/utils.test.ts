import { isTokenExpired } from '@/lib/utils'
import { describe, expect, test } from 'vitest'

describe('isTokenExpired', () => {
  test('should return true if token is null', () => {
    expect(isTokenExpired(null)).toBe(true)
  })

  test('should return true if token does not have exp field', () => {
    expect(isTokenExpired({})).toBe(true)
  })

  test('should return false if token is not expired', () => {
    const futureToken = { exp: Math.round(Date.now() / 1000) + 1000 } // Expiry in the future
    expect(isTokenExpired(futureToken)).toBe(false)
  })

  test('should return true if token is expired', () => {
    const expiredToken = { exp: Math.round(Date.now() / 1000) - 1000 } // Expired in the past
    expect(isTokenExpired(expiredToken)).toBe(true)
  })
})
