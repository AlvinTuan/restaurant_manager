import { authApi } from '@/pages/login/auth.service'
import authReducer from '@/pages/login/auth.slice'
import { rtkQueryErrorLogger } from '@/redux/middleware'
import { accountSlice } from '@/redux/slice/accountSlice'
import { dishesSlice } from '@/redux/slice/dishesSlice'
import { tablesSlice } from '@/redux/slice/tablesSlice'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

// const persistConfig = {
//   key: 'root',
//   storage
// }

// const persistedAuthReducer = persistReducer(persistConfig, authSlice.reducer)
// const persistedAccountReducer = persistReducer(persistConfig, accountSlice.reducer)
// const persistedDishesReducer = persistReducer(persistConfig, dishesSlice.reducer)

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//     account: persistedAccountReducer,
//     dishes: persistedDishesReducer
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false
//     })
// })

// export const persistor = persistStore(store)

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountSlice.reducer,
    dishes: dishesSlice.reducer,
    tables: tablesSlice.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(authApi.middleware, rtkQueryErrorLogger)
  }
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
