import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className='flex items-center justify-center w-full h-screen px-16 bg-gray-200 md:px-0'>
          <div className='flex flex-col items-center justify-center px-4 py-8 bg-white border border-gray-200 rounded-lg shadow-2xl md:px-8 lg:px-24'>
            <p className='text-6xl font-bold tracking-wider text-gray-300 md:text-7xl lg:text-9xl'>500</p>
            <p className='mt-4 text-2xl font-bold tracking-wider text-gray-500 md:text-3xl lg:text-5xl'>Server Error</p>
            <p className='py-2 mt-8 text-center text-gray-500 border-y-2'>
              Whoops, something went wrong on our servers.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
