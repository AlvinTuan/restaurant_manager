import { EntityError } from '@/lib/http'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}

export function isEntityError(error: unknown): error is EntityError {
  return isFetchBaseQueryError(error) && error.status === 422 && Array.isArray((error as any).payload?.errors)
}
