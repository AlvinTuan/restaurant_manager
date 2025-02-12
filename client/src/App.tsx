import Login from '@/pages/login'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />}></Route>
    </Routes>
  )
}

export default App
