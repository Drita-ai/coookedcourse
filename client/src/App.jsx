import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import CookedCourse from './pages/CookedCourse'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<CookedCourse />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
