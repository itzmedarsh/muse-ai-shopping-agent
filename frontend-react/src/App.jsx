
import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Results from './pages/Results'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Store from './pages/Store'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'

function MuseLoader({ leaving }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setMouse({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    })
  }

  const mouseX = mouse.x * 22
  const mouseY = mouse.y * 16

  return (
    <div
      className={`muse-loader ${leaving ? 'muse-loader-exit' : ''}`}
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mouseX}px`,
        '--mouse-y': `${mouseY}px`,
        '--light-x': `${50 + mouse.x * 12}%`,
        '--light-y': `${50 + mouse.y * 12}%`,
      }}
    >
      {/* Ambient background */}
      <div className="loader-glow glow-one" />
      <div className="loader-glow glow-two" />

      {/* Giant interactive MUSE background */}
      <div className="loader-background">
        <div className="loader-background-shadow">MUSE</div>
        <div className="loader-background-word">MUSE</div>
      </div>

      {/* Mouse-following lighting */}
      <div className="loader-cursor-light" />

      {/* Central loading animation */}
      <div className="loader-content">

        <div className="loader-orbit orbit-one">
          <span className="orbit-dot dot-one" />
        </div>

        <div className="loader-orbit orbit-two">
          <span className="orbit-dot dot-two" />
        </div>

        <div className="loader-orbit orbit-three">
          <span className="orbit-dot dot-three" />
        </div>

        <div className="loader-core">
          <div className="loader-core-inner">M</div>
        </div>

        <h1 className="loader-brand">
          MUSE<span>.</span>
        </h1>

        <p className="loader-tagline">
          YOUR PERSONAL AI SHOPPING AGENT
        </p>

        <div className="loader-progress">
          <div className="loader-progress-fill" />
        </div>

        <p className="loader-message">
          Crafting your experience
        </p>
      </div>

      {/* Bottom branding */}
      <div className="loader-bottom">
        <span>DISCOVER BETTER.</span>
        <span>COMPARE SMARTER.</span>
        <span>BUY CONFIDENTLY.</span>
      </div>

      <style>{`

        /* MAIN LOADER */

        .muse-loader {
          position: fixed;
          inset: 0;
          z-index: 99999;
          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #08070e;
          color: white;
          font-family: inherit;
          isolation: isolate;

          opacity: 1;
          transform: scale(1);

          animation: loader-appear .35s ease both;

          transition:
            opacity .5s ease,
            transform .65s cubic-bezier(.2,.8,.2,1);
        }

        .muse-loader-exit {
          opacity: 0;
          transform: scale(1.06);
          pointer-events: none;
        }

        /* AMBIENT GLOW */

        .loader-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(110px);
          opacity: .2;
          pointer-events: none;
        }

        .glow-one {
          background: #792cff;
          top: 5%;
          left: 12%;
          animation: glow-float 5s ease-in-out infinite alternate;
        }

        .glow-two {
          background: #3420a8;
          bottom: 2%;
          right: 10%;
          animation: glow-float 6s ease-in-out infinite alternate-reverse;
        }

        /* GIANT BACKGROUND TYPOGRAPHY */

        .loader-background {
          position: absolute;
          inset: 0;
          z-index: 1;

          display: flex;
          align-items: flex-start;
          justify-content: center;

          padding-top: 7vh;
          pointer-events: none;
          perspective: 1000px;
          overflow: hidden;
        }

        .loader-background-word,
        .loader-background-shadow {
          position: absolute;
          top: 0;
          left: 50%;

          font-size: clamp(90px, 18vw, 260px);
          font-weight: 950;
          letter-spacing: -.105em;
          line-height: 1;
          white-space: nowrap;

          user-select: none;
        }

        .loader-background-word {
          color: transparent;
          -webkit-text-stroke: 1.5px #b99aff40;

          transform:
            translate3d(
              calc(-50% + var(--mouse-x)),
              var(--mouse-y),
              0
            )
            rotateY(calc(var(--mouse-x) * .025));

          transition: transform .18s ease-out;

          animation: background-breathe 4s ease-in-out infinite;
        }

        .loader-background-shadow {
          color: #a855f70a;

          transform: translate3d(
            calc(-50% - var(--mouse-x) * 1.3),
            calc(var(--mouse-y) * -1.2),
            -40px
          );

          filter: blur(2px);
          transition: transform .25s ease-out;
        }

        /* CURSOR LIGHT */

        .loader-cursor-light {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;

          background: radial-gradient(
            circle at var(--light-x) var(--light-y),
            #8b5cf71c,
            transparent 38%
          );

          transition: background .15s ease;
        }

        /* CENTRAL CONTENT */

        .loader-content {
          position: relative;
          z-index: 3;

          display: flex;
          align-items: center;
          flex-direction: column;

          transform: translate3d(
            calc(var(--mouse-x) * .35),
            calc(var(--mouse-y) * .35 + 7vh),
            0
          );

          transition: transform .25s ease-out;
        }

        /* CENTRAL LOGO */

        .loader-core {
          width: 92px;
          height: 92px;
          border-radius: 28px;

          display: grid;
          place-items: center;

          background: linear-gradient(
            135deg,
            #a855f7,
            #5b21b6,
            #312e81
          );

          box-shadow:
            0 0 70px #8b5cf677,
            inset 0 1px 1px #ffffff66;

          animation: core-pulse 2s ease-in-out infinite;
        }

        .loader-core-inner {
          font-size: 43px;
          font-weight: 800;
          letter-spacing: -5px;
          text-shadow: 0 3px 20px #0008;
        }

        /* ORBITAL RINGS */

        .loader-orbit {
          position: absolute;
          left: 50%;
          top: 46px;

          border: 1px solid #a78bfa45;
          border-radius: 50%;
          pointer-events: none;
        }

        .orbit-one {
          width: 150px;
          height: 150px;
          margin-left: -75px;
          animation: orbit-spin 5s linear infinite;
        }

        .orbit-two {
          width: 190px;
          height: 190px;
          margin-left: -95px;
          top: 26px;
          animation: orbit-spin 8s linear infinite reverse;
        }

        .orbit-three {
          width: 230px;
          height: 230px;
          margin-left: -115px;
          top: 6px;
          animation: orbit-spin 12s linear infinite;
        }

        .orbit-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;

          background: #c4b5fd;
          box-shadow: 0 0 18px #a855f7;
        }

        .dot-one {
          top: 15px;
          left: 18px;
        }

        .dot-two {
          bottom: 25px;
          right: 12px;
          width: 6px;
          height: 6px;
        }

        .dot-three {
          top: 40px;
          right: 8px;
          width: 5px;
          height: 5px;
        }

        /* BRAND TEXT */

        .loader-brand {
          margin-top: 150px;

          font-size: 43px;
          font-weight: 800;
          letter-spacing: 9px;

          background: linear-gradient(
            90deg,
            #fff,
            #c4b5fd,
            #fff
          );

          background-size: 200% auto;
          color: transparent;
          background-clip: text;

          animation: brand-shine 3s linear infinite;
        }

        .loader-brand span {
          color: #a78bfa;
        }

        .loader-tagline {
          margin-top: 8px;
          color: #b0a5c5;

          font-size: 10px;
          letter-spacing: 4px;
          text-align: center;
        }

        /* PROGRESS BAR */

        .loader-progress {
          margin-top: 42px;
          width: 190px;
          height: 2px;

          overflow: hidden;
          background: #ffffff17;
          border-radius: 10px;
        }

        .loader-progress-fill {
          width: 0%;
          height: 100%;

          background: linear-gradient(
            90deg,
            #7c3aed,
            #c4b5fd
          );

          box-shadow: 0 0 15px #a78bfa;

          animation: progress-run 1.35s ease-in-out forwards;
        }

        .loader-message {
          margin-top: 15px;
          color: #b0a5c5;

          font-size: 11px;
          letter-spacing: 1.5px;

          animation: message-pulse 1.4s ease-in-out infinite;
        }

        /* BOTTOM TEXT */

        .loader-bottom {
          position: absolute;
          z-index: 4;
          bottom: 32px;

          display: flex;
          justify-content: center;
          gap: 28px;

          color: #827895;
          font-size: 9px;
          letter-spacing: 2px;
        }

        /* PAGE ANIMATIONS */

        @keyframes loader-appear {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes orbit-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes core-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }

        @keyframes glow-float {
          from { transform: translate3d(-25px, -15px, 0); }
          to { transform: translate3d(35px, 25px, 0); }
        }

        @keyframes brand-shine {
          to { background-position: 200% center; }
        }

        @keyframes progress-run {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes message-pulse {
          0%, 100% { opacity: .45; }
          50% { opacity: 1; }
        }

        @keyframes background-breathe {
          0%, 100% { opacity: .55; }
          50% { opacity: 1; }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .loader-background {
            padding-top: 12vh;
          }

          .loader-background-word,
          .loader-background-shadow {
            font-size: 23vw;
          }

          .loader-content {
            transform: translate3d(
              calc(var(--mouse-x) * .2),
              calc(var(--mouse-y) * .2 + 5vh),
              0
            ) scale(.88);
          }

          .loader-bottom {
            gap: 10px;
            font-size: 7px;
            letter-spacing: 1px;
          }

          .loader-core {
            width: 78px;
            height: 78px;
          }

          .loader-orbit {
            top: 53px;
          }

          .orbit-two {
            top: 33px;
          }

          .orbit-three {
            top: 13px;
          }

          .loader-brand {
            font-size: 36px;
          }

          .loader-tagline {
            font-size: 8px;
            letter-spacing: 2px;
          }
        }

        /* SMALL SCREENS */

        @media (max-height: 700px) and (min-width: 601px) {
          .loader-background {
            padding-top: 3vh;
          }

          .loader-content {
            transform: translate3d(
              calc(var(--mouse-x) * .3),
              calc(var(--mouse-y) * .3 + 4vh),
              0
            ) scale(.8);
          }

          .loader-bottom {
            bottom: 16px;
          }
        }

        /* ACCESSIBILITY */

        @media (prefers-reduced-motion: reduce) {
          .muse-loader *,
          .muse-loader {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }

      `}</style>
    </div>
  )
}

function AppContent() {
  const location = useLocation()

  const [loading, setLoading] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('muse-user') || 'null') } catch { return null }
  })

  useEffect(() => {
    setLoading(true)
    setLeaving(false)

    const exitTimer = setTimeout(() => {
      setLeaving(true)
    }, 1150)

    const removeTimer = setTimeout(() => {
      setLoading(false)
    }, 1600)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [location.pathname])

  useEffect(() => {
    try { setCurrentUser(JSON.parse(localStorage.getItem('muse-user') || 'null')) } catch { setCurrentUser(null) }
  }, [location.pathname])

  return (
    <>
      {/* Page transition animation */}
      <style>{`
        .muse-page-enter {
          animation: muse-page-reveal .8s cubic-bezier(.2,.8,.2,1) both;
        }

        @keyframes muse-page-reveal {
          from {
            opacity: 0;
            transform: translateY(16px) scale(.99);
            filter: blur(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .muse-page-enter {
            animation: none;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="flex items-center justify-between bg-[#11101b] px-8 py-4 text-white">
        <Link
          to="/"
          className="text-2xl font-bold text-violet-400"
        >
          MUSE
        </Link>

        <div className="flex gap-6 text-sm">
          <Link to="/">Home</Link>
          <Link to="/store">Store</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">{currentUser ? currentUser.name || "Account" : "Login"}</Link>
        </div>
      </nav>

      {/* Application routes */}
      <div
        key={location.pathname}
        className="muse-page-enter"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />

          <Route path="/store" element={<Store />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="*"
            element={<div className="min-h-screen bg-[#090811] p-12 text-center text-white"><h1 className="text-3xl font-bold">Page not found</h1><Link to="/" className="mt-5 inline-block text-violet-300">Back to Home</Link></div>}
          />
        </Routes>
      </div>

      {/* Global cinematic loader */}
      {loading && <MuseLoader leaving={leaving} />}
    </>
  )
}

export default function App() {
  return <AppContent />
}
