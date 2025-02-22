import { dishApiRequest } from '@/apiRequests/dishes.api'
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DishesState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  dishes: DishListResType['data']
  editingDish: DishResType['data'] | null
}

const initialState: DishesState = {
  status: 'idle',
  dishes: [],
  editingDish: null
}

export const dishesSlice = createSlice({
  name: 'dishes',
  initialState,
  reducers: {
    startEditDish: (state, action: PayloadAction<number>) => {
      const dishId = action.payload
      const foundDish = state.dishes.find((dish) => dish.id === dishId) || null
      state.editingDish = foundDish
    }
  },
  extraReducers(builder) {
    builder
      .addCase(getDishes.fulfilled, (state, action) => {
        console.log(action)
        state.dishes = action.payload.data
      })
      .addCase(addDish.fulfilled, (state, action) => {
        state.dishes.unshift(action.payload.data)
      })
      .addCase(updateDish.fulfilled, (state, action) => {
        state.dishes.some((dish, index) => {
          if (dish.id === action.payload.data.id) {
            state.dishes[index] = action.payload.data
            return true
          }
          return false
        })
        state.editingDish = null
      })
      .addCase(deleteDish.fulfilled, (state, action) => {
        const findIndexDish = state.dishes.findIndex((dish) => dish.id === action.meta.arg)
        if (findIndexDish !== -1) {
          state.dishes.splice(findIndexDish, 1)
        }
      })
  }
})

export const getDishes = createAsyncThunk('dishes/getDishes', async (_, thunkAPI) => {
  try {
    const res = await dishApiRequest.list()
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const addDish = createAsyncThunk('dishes/addDish', async (body: CreateDishBodyType, thunkAPI) => {
  try {
    const res = await dishApiRequest.addDish(body)
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const updateDish = createAsyncThunk(
  'dish/updateDish',
  async ({ id, body }: { id: number; body: UpdateDishBodyType }, thunkAPI) => {
    try {
      const res = await dishApiRequest.updateDish(id, body)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteDish = createAsyncThunk('dish/deleteDish', async (id: number, thunkAPI) => {
  try {
    const res = await dishApiRequest.deleteDish(id)
    return res.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const { startEditDish } = dishesSlice.actions
