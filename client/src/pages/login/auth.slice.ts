import { RoleType } from '@/constants/jwt.types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Socket } from 'socket.io-client'

interface AuthState {
  role: RoleType | undefined
  socket: Socket | undefined
}

const initialState: AuthState = {
  role: undefined,
  socket: undefined
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<RoleType | undefined>) => {
      state.role = action.payload
    }
  }
})

const authReducer = authSlice.reducer
export const { setRole } = authSlice.actions
export default authReducer
