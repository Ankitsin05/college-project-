import { useEffect } from 'react'
import { Routes, Route } from "react-router-dom"

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import AboutUs from './components/AboutUs'
import Feedback from './components/Feedback'
import Contact from './components/Contact'
import Footer from './components/Footer'
import OfflineBanner from './components/OfflineBanner'

import Login from './pages/Login'
import Register from './pages/Register'
import TouristDashboard from './pages/TouristDashboard'

import './App.css'

import VerifyUser from "./pages/VerifyUser";

function App() {

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <OfflineBanner />

      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <main>
              <Hero />
              <Features />
              <HowItWorks />
              <AboutUs />
              <Feedback />
              <Contact />
            </main>
            <Footer />
          </>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<TouristDashboard />} />
        <Route path="/verify/:id" element={<VerifyUser />} />
      </Routes>
    </>
  )
}

export default App