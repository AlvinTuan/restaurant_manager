import { RoleType } from '@/constants/jwt.types'
import { clearLS, getAccessTokenFromLS } from '@/lib/auth'
import { decodeToken, generateSocketInstance } from '@/lib/utils'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (_role?: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (_socket?: Socket | undefined) => {},
  disconnectSocket: () => {}
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | undefined>()
  const [role, setRoleState] = useState<RoleType | undefined>()
  const count = useRef(0)

  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLS()
      if (accessToken) {
        const role = decodeToken(accessToken)?.role
        setRoleState(role)
        setSocket(generateSocketInstance(accessToken))
      }
      count.current++
    }
  }, [])

  const disconnectSocket = () => {
    socket?.disconnect()
    setSocket(undefined)
  }

  // Các bạn nào mà dùng Next.js 15 và React 19 thì không cần dùng useCallback đoạn này cũng được
  const setRole = (role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      clearLS()
    }
  }
  const isAuth = Boolean(role)
  // Nếu mọi người dùng React 19 và Next.js 15 thì không cần AppContext.Provider, chỉ cần AppContext là đủ
  return (
    <AppContext.Provider value={{ role, setRole, isAuth, socket, setSocket, disconnectSocket }}>
      {children}
    </AppContext.Provider>
  )
}
