import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Workflow from "./components/Workflow";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-vfx-dark selection:bg-neon-blue selection:text-vfx-dark">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Workflow />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
