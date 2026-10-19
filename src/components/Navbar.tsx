import { motion } from "motion/react";
import { Menu, X, Youtube, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import MouseHouseLogo from "./MouseHouseLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Our Works", href: "#works" },
    { name: "Workflow", href: "#workflow" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-vfx-dark/80 backdrop-blur-lg py-4 border-b border-white/10" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <a href="#home" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-neon-blue/50 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.25)] transition-all">
              <MouseHouseLogo size={36} showText={false} variant="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-neon-blue transition-colors">
                MOUSE HOUSE <span className="text-neon-blue">VFX</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
                Visual Effects Studio
              </span>
            </div>
          </a>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-300 hover:text-neon-blue transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <a href="https://www.instagram.com/sreeragps_official?igsh=bmc3czNkNmZvNnl5" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 w-full bg-vfx-dark border-b border-white/10 py-6 px-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-gray-300 hover:text-neon-blue"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
