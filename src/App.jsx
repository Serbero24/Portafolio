import Starfield from './components/Starfield'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CursorFlock from './components/CursorFlock'
import TechMarquee from './components/TechMarquee'
import CommandPalette from './components/CommandPalette'
import Blueprint from './components/Blueprint'

export default function App() {
  return (
    <>
      <Starfield />
      <CursorFlock />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <Blueprint />
      <CommandPalette />
    </>
  )
}
