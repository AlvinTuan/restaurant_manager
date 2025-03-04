import { ThemeProvider } from '@/components/theme-provider.tsx'
import AppProvider from '@/context/app-provider.tsx'
import { store } from '@/redux/store.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <AppProvider>
        <Provider store={store}>
          {/* <PersistGate loading={null} persistor={persistor}> */}
          <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ThemeProvider>
          {/* </PersistGate> */}
        </Provider>
      </AppProvider>
    </HelmetProvider>
  </StrictMode>
)
