import accountApi from '@/apiRequests/account.api'
import { mediaRequest } from '@/apiRequests/media.api'
import { AccountResType } from '@/schemaValidations/account.schema'
import { UploadImageResType } from '@/schemaValidations/media.schema'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface AccountState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  account: AccountResType['data'] | null
}

const initialState: AccountState = {
  status: 'idle',
  account: null
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMe.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.account = action.payload.data
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.status = 'succeeded'
        if (state.account) {
          state.account.avatar = action.payload.data
        }
      })
  }
})

export const getMe = createAsyncThunk<AccountResType>('accounts/me', async (_props, thunkAPI) => {
  try {
    const res = await accountApi.me({ signal: thunkAPI.signal })
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue({ error })
  }
})

export const uploadImage = createAsyncThunk<UploadImageResType, FormData>(
  'media/upload',
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await mediaRequest.uploadImage(formData)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue({ error })
    }
  }
)
