import { AccountResType } from '@/schemaValidations/account.schema'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  isLoggedIn: boolean
  account: AccountResType['data'] | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  account: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut: (state, _action) => {
      state.isLoggedIn = false
      state.account = null
    }
  }
})

const authReducer = authSlice.reducer
export const { signOut } = authSlice.actions
export default authReducer
