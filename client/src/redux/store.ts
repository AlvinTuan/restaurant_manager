import { authApi } from '@/pages/login/auth.service'
import authReducer from '@/pages/login/auth.slice'
import { rtkQueryErrorLogger } from '@/redux/middleware'
import { accountApi } from '@/services/account.service'
import { dashboardApi } from '@/services/dashboard.service'
import { dishesApi } from '@/services/dishes.service'
import { guestApi } from '@/services/guest.service'
import { mediaApi } from '@/services/media.service'
import { ordersApi } from '@/services/orders.service'
import { tablesApi } from '@/services/tables.service'
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
    [authApi.reducerPath]: authApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [mediaApi.reducerPath]: mediaApi.reducer,
    [dishesApi.reducerPath]: dishesApi.reducer,
    [tablesApi.reducerPath]: tablesApi.reducer,
    [guestApi.reducerPath]: guestApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(
      authApi.middleware,
      accountApi.middleware,
      mediaApi.middleware,
      dishesApi.middleware,
      tablesApi.middleware,
      guestApi.middleware,
      ordersApi.middleware,
      dashboardApi.middleware,
      rtkQueryErrorLogger
    )
  }
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
