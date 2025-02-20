import accountApi from '@/apiRequests/account.api'
import { mediaRequest } from '@/apiRequests/media.api'
import {
  AccountListResType,
  AccountResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType
} from '@/schemaValidations/account.schema'
import { UploadImageResType } from '@/schemaValidations/media.schema'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface AccountState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  account: AccountResType['data'] | null
  employeeList: AccountListResType['data']
  employeeCurrent: AccountResType['data'] | null
}

const initialState: AccountState = {
  status: 'idle',
  account: null,
  employeeList: [],
  employeeCurrent: null
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
      // .addCase(uploadImage.fulfilled, (state, action) => {
      //   state.status = 'succeeded'
      //   if (state.account) {
      //     state.account.avatar = action.payload.data
      //   }
      // })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.account = action.payload.data
      })
      .addCase(getAccountList.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employeeList = action.payload.data
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employeeList.unshift(action.payload.data)
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employeeList.find((account, index) => {
          if (account.id === action.meta.arg.id) {
            state.employeeList[index] = action.payload.data
            return true
          }
          return false
        })
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.employeeCurrent = action.payload.data
      })
  }
})

export const getMe = createAsyncThunk<AccountResType>('accounts/getMe', async (_props, thunkAPI) => {
  try {
    const res = await accountApi.meRequest({ signal: thunkAPI.signal })
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateMe = createAsyncThunk<AccountResType, UpdateMeBodyType>(
  'accounts/updateMe',
  async (body: UpdateMeBodyType, thunkAPI) => {
    try {
      const res = await accountApi.updateMeRequest(body)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

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

export const getAccountList = createAsyncThunk<AccountListResType>('accounts/getAccountList', async (_, thunkAPI) => {
  try {
    const res = await accountApi.getListRequest()
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const addEmployee = createAsyncThunk<AccountResType, CreateEmployeeAccountBodyType>(
  'accounts/addEmployee',
  async (body, thunkAPI) => {
    try {
      const res = await accountApi.addEmployeeRequest(body)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateEmployee = createAsyncThunk(
  'accounts/updateEmployee',
  async ({ id, body }: { id: number; body: UpdateEmployeeAccountBodyType }, thunkAPI) => {
    try {
      const res = await accountApi.updateEmployeeRequest(id, body)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getEmployee = createAsyncThunk<AccountResType, number>('accounts/getEmployee', async (id, thunkAPI) => {
  try {
    const res = await accountApi.getEmployeeRequest(id)
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const deleteEmployee = createAsyncThunk<AccountResType, number>(
  'accounts/deleteEmployee',
  async (id, thunkAPI) => {
    try {
      const res = await accountApi.deleteEmployeeRequest(id)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
