import ErrorBoundary from '@/components/error-boundary.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/toaster'
import AppProvider from '@/context/app-provider.tsx'
import { useRouteElement } from '@/hooks/use-route-element'
import { store } from '@/redux/store.ts'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import './index.scss'

function App() {
  const routeElement = useRouteElement()

  return (
    <>
      <HelmetProvider>
        <AppProvider>
          <Provider store={store}>
            {/* <PersistGate loading={null} persistor={persistor}> */}
            <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
              <ErrorBoundary>
                {routeElement}
                <Toaster></Toaster>
              </ErrorBoundary>
            </ThemeProvider>
            {/* </PersistGate> */}
          </Provider>
        </AppProvider>
      </HelmetProvider>
    </>
  )
}

export default App
