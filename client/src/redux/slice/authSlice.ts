import authApi from '@/apiRequests/auth.api'
import { LoginBodyType, LoginResType, LogoutBodyType } from '@/schemaValidations/auth.schema'
import { getAccessTokenFromLS } from '@/utils/auth'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  isLoggedIn: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  account?: LoginResType['data']['account']
  error?: string
}

const initialState: AuthState = {
  isLoggedIn: Boolean(getAccessTokenFromLS()),
  status: 'idle'
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signOut: (state, _action: PayloadAction) => {
      state.isLoggedIn = false
      state.status = 'idle'
      state.account = undefined
    }
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true
        state.status = 'succeeded'
        state.account = action.payload.data.account
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false
        state.status = 'failed'
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false
        state.status = 'idle'
        state.account = undefined
      })
  }
})

export const login = createAsyncThunk<LoginResType, LoginBodyType>('auth/login', async (body, thunkAPI) => {
  try {
    const res = await authApi.loginRequest(body)
    return res.data // Đảm bảo trả về dữ liệu JSON thực tế
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const logout = createAsyncThunk<{ message: string }, LogoutBodyType>('auth/logout', async (body) => {
  const res = await authApi.logoutRequest(body)
  return res.data
})
