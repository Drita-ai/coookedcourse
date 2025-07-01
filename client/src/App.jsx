import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { SearchedItemsProvider } from './contexts/SearchedItemsContext.jsx'

import CookedCourse from './pages/CookedCourse'
import DisplayCookedCourse from './pages/DisplayCookedCourse.jsx'
import PageNotFound from './pages/PageNotFound.jsx'

function App() {
  return (
    <SearchedItemsProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<CookedCourse />} />
          <Route path='/display-cooked-course' element={<DisplayCookedCourse />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </SearchedItemsProvider>
  )
}

export default App
