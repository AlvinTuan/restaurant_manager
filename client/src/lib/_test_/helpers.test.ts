import { isEntityError } from '@/lib/helpers'
import { EntityError } from '@/lib/http'
import { describe, expect, test } from 'vitest'

describe('test isEntityError', () => {
  test('isEntityError --> false', () => {
    expect(isEntityError(new Error())).toBe(false)
  })

  test('isEntityError --> true', () => {
    expect(
      isEntityError(
        new EntityError({
          status: 422,
          payload: {
            message: 'entity error',
            errors: [
              {
                field: 'email',
                message: ''
              }
            ]
          }
        })
      )
    ).toBe(true)
  })
})
