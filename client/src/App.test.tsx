import { path } from '@/constants/path'
import { renderWithRouter } from '@/lib/testUtils'
import matchers from '@testing-library/jest-dom/matchers'
import { screen, waitFor } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

expect.extend(matchers)

describe('App', async () => {
  // test('App render và chuyển trang', async () => {
  //   render(<App />, {
  //     wrapper: BrowserRouter
  //   })
  // })

  // test trang not found
  test('Về trang not found', async () => {
    const badRoute = '/some/bad/route'
    renderWithRouter({ route: badRoute })
    await waitFor(() => {
      expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    })
  })

  //test trang login
  test('Trang login', async () => {
    renderWithRouter({ route: path.login })
    await waitFor(() => {
      expect(screen.getByText(/Email/i)).toBeInTheDocument()
    })
  })

  // await logScreen()
})
