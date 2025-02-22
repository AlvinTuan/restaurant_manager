import { accountSlice } from '@/redux/slice/accountSlice'
import { authSlice } from '@/redux/slice/authSlice'
import { dishesSlice } from '@/redux/slice/dishesSlice'
import { tablesSlice } from '@/redux/slice/tablesSlice'
import { configureStore } from '@reduxjs/toolkit'

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
    auth: authSlice.reducer,
    account: accountSlice.reducer,
    dishes: dishesSlice.reducer,
    tables: tablesSlice.reducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
