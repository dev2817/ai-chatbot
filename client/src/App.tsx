import { PersistGate } from 'redux-persist/integration/react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { Provider } from 'react-redux'
import store, { persistor } from './store/store'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div className='h-screen justify-center w-screen overflow-x-hidden'>
            <AppRoutes />
          </div>
        </PersistGate>
      </Provider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
      />
    </>
  )
}

export default App
