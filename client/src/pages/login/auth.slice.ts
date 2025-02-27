import { RoleType } from '@/constants/jwt.types'
import { getAccessTokenFromLS } from '@/lib/auth'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  role: RoleType | undefined
  isAuth: boolean
}

const initialState: AuthState = {
  role: undefined,
  isAuth: Boolean(getAccessTokenFromLS())
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<RoleType | undefined>) => {
      state.role = action.payload
      if (action.payload === undefined) {
        state.isAuth = false
      }
    }
  }
})

const authReducer = authSlice.reducer
export const { setRole } = authSlice.actions
export default authReducer
