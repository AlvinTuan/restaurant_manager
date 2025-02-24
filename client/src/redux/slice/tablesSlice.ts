import { tableApiRequest } from '@/apiRequests/table.api'
import { CreateTableBodyType, TableListResType, UpdateTableBodyType } from '@/schemaValidations/table.schema'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export interface TableState {
  tables: TableListResType['data']
  editTableId: number | null
}

export const initialState: TableState = {
  tables: [],
  editTableId: null
}

export const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getTables.fulfilled, (state, action) => {
        state.tables = action.payload.data
      })
      .addCase(addTable.fulfilled, (state, action) => {
        state.tables.unshift(action.payload.data)
      })
      .addCase(updateTable.fulfilled, (state, action) => {
        state.tables.some((table, index) => {
          if (table.number === action.payload.data.number) {
            state.tables[index] = action.payload.data
            return true
          }
          return false
        })
      })
      .addCase(deleteTable.fulfilled, (state, action) => {
        const findIndexTable = state.tables.findIndex((table) => table.number === action.meta.arg)
        if (findIndexTable !== -1) {
          state.tables.splice(findIndexTable, 1)
        }
      })
  }
})

export const getTables = createAsyncThunk('tables/getTables', async (_, thunkAPI) => {
  try {
    const res = await tableApiRequest.getList()
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getTableDetail = createAsyncThunk('table/getTable', async (id: number, thunkAPI) => {
  try {
    const res = await tableApiRequest.getTableDetail(id)
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const addTable = createAsyncThunk('table/addTable', async (body: CreateTableBodyType, thunkAPI) => {
  try {
    const res = await tableApiRequest.addTable(body)
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateTable = createAsyncThunk(
  'table/updateTable',
  async ({ id, body }: { id: number; body: UpdateTableBodyType }, thunkAPI) => {
    try {
      const res = await tableApiRequest.updateTable(id, body)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteTable = createAsyncThunk('table/deleteTable', async (id: number, thunkAPI) => {
  try {
    const res = await tableApiRequest.deleteTable(id)
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
