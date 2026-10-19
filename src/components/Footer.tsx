import { Instagram, Youtube, Twitter, Linkedin, Lock, ShieldCheck } from "lucide-react";
import MouseHouseLogo from "./MouseHouseLogo";
import { useStudioAdmin } from "../context/AdminContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAdmin, openAuthModal } = useStudioAdmin();

  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-2 rounded-2xl bg-white/5 border border-white/10">
                <MouseHouseLogo size={52} showText={false} variant="white" />
              </div>
              <div>
                <span className="font-display font-black text-2xl tracking-tighter text-white block">
                  MOUSE HOUSE <span className="text-neon-blue">VFX</span>
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-gray-500">
                  Visual Effects &amp; Compositing Studio
                </span>
              </div>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              Professional Visual Effects & Compositing Studio turning imagination into cinematic reality. 
              Pushing the boundaries of digital storytelling since 2020.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#home" className="hover:text-neon-blue transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-neon-blue transition-colors">Services</a></li>
              <li><a href="#works" className="hover:text-neon-blue transition-colors">Our Works</a></li>
              <li><a href="#contact" className="hover:text-neon-blue transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/sreeragps_official?igsh=bmc3czNkNmZvNnl5" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-neon-blue transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-neon-blue transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-neon-blue transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:text-neon-blue transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} Mouse House VFX. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            {/* Discreet Studio Owner Login Button */}
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-neon-blue transition-colors"
              title="Studio Owner Access (Private)"
            >
              {isAdmin ? (
                <>
                  <ShieldCheck size={12} className="text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Studio Owner (Active)</span>
                </>
              ) : (
                <>
                  <Lock size={11} />
                  <span>Studio Access</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
