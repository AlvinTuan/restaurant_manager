import authApi from '@/apiRequests/auth.api'
import { LoginBodyType, LoginResType } from '@/schemaValidations/auth.schema'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface AuthState {
  isLoggedIn: boolean
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  account?: LoginResType['data']['account']
  error?: string
}

const initialState: AuthState = {
  isLoggedIn: false,
  status: 'idle'
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggedIn = true
      state.status = 'succeeded'
      state.account = action.payload.data.account
    })
  }
})

export const login = createAsyncThunk<LoginResType, LoginBodyType>('auth/login', async (info, thunkAPI) => {
  try {
    const res = await authApi.loginRequest(info, { signal: thunkAPI.signal })
    return res.data // Đảm bảo trả về dữ liệu JSON thực tế
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
