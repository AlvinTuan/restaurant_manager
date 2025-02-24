import { ThemeProvider } from '@/components/theme-provider.tsx'
import { store } from '@/redux/store.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
      {/* </PersistGate> */}
    </Provider>
  </StrictMode>
)
