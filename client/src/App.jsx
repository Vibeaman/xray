import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Results from './pages/Results'
import Wallet from './pages/Wallet'
import WalletResults from './pages/WalletResults'
import PfpStudio from './pages/PfpStudio'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  // Apply dark class to html element for proper cascading
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/results/:username" element={<Results />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/:address" element={<WalletResults />} />
          <Route path="/pfp-studio" element={<PfpStudio />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
