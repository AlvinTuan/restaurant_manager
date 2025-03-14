import { path } from '@/constants/path'
import { renderWithRouter } from '@/lib/testUtils'
import matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeAll, describe, expect, test } from 'vitest'

expect.extend(matchers)

describe('Test Login Form', () => {
  beforeAll(async () => {
    renderWithRouter({ route: path.login })
  })

  test('Lỗi không nhập gì', async () => {
    const submitButton = await screen.findByRole('button', { name: /Đăng nhập/i })
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
      expect(screen.getByText('String must contain at least 6 character(s)')).toBeInTheDocument()
    })
  })

  test('Lỗi không nhập đúng định dạng', async () => {
    const emailInput = await screen.findByPlaceholderText('user@example.com')
    const passwordInput = await screen.findByPlaceholderText('Password')
    const submitButton = await screen.findByRole('button', { name: /Đăng nhập/i })

    await userEvent.type(emailInput, 'test@mail')
    await userEvent.type(passwordInput, '123')
    await userEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument()
      expect(screen.getByText('String must contain at least 6 character(s)')).toBeInTheDocument()
    })
  })
})
