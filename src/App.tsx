import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Market from './pages/Market'
import Trade from './pages/Trade'
import Assets from './pages/Assets'
import TabBar from './components/TabBar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<Market />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/assets" element={<Assets />} />
        </Routes>
        <TabBar />
      </div>
    </BrowserRouter>
  )
}

export default App
