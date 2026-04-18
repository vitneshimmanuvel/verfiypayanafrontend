import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbartop from './components/Navbartop'
import HomePage from './components/HomePage'
import LanguageCourse from './components/LanguageCourse'
import Footer from './components/Footer'
import FooterBanner from './components/FooterBanner'
import WhatsAppButton from './components/WhatsAppButton'

function App() {
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div className='total'>
      <Navbartop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/language/:lang" element={<LanguageCourse />} />
      </Routes>

      <Footer />
      <FooterBanner/>
      <WhatsAppButton />
    </div>
  )
}

export default App
