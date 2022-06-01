import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '../contexts/app'
import PrivateRoute from '../components/privateRoute';


function App({ Component, pageProps }: AppProps) {
  const protectedRoutes = ['/success'];

  return (
    <AppProvider>
      <PrivateRoute protectedRoutes={protectedRoutes}>
        <Component {...pageProps} />
      </PrivateRoute>
    </AppProvider>
  )
}

export default App
