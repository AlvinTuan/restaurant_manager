import authApi from '@/apiRequests/auth.api'
import { getAccessTokenFromLS } from '@/lib/auth'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN } from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType
} from '@/schemaValidations/auth.schema'
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
        state.status = 'succeeded'
        state.isLoggedIn = true
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
      .addCase(logout.rejected, (state) => {
        state.isLoggedIn = false
        state.status = 'idle'
        state.account = undefined
      })
  }
})

export const login = createAsyncThunk<LoginResType, LoginBodyType>(URL_LOGIN, async (body, thunkAPI) => {
  try {
    const res = await authApi.loginRequest(body)
    return res.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const logout = createAsyncThunk<{ message: string }, LogoutBodyType>(URL_LOGOUT, async (body) => {
  const res = await authApi.logoutRequest(body)
  return res.data
})

export const refreshToken = createAsyncThunk<RefreshTokenResType, RefreshTokenBodyType>(
  URL_REFRESH_TOKEN,
  async (body, thunkAPI) => {
    try {
      const res = await authApi.refreshTokenRequest(body)
      return res.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
