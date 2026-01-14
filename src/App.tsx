import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Market from './pages/Market'
import Trade from './pages/Trade'
import Assets from './pages/Assets'
import Install from './pages/Install'
import TabBar from './components/TabBar'
import './App.css'

function AppContent() {
  const location = useLocation()
  const showTabBar = location.pathname !== '/install'

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Market />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/install" element={<Install />} />
      </Routes>
      {showTabBar && <TabBar />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app">
        <AppContent />
      </div>
    </BrowserRouter>
  )
}

export default App
