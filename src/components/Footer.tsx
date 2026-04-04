import { Instagram, Youtube, Twitter, Linkedin, Mouse } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src="/logo.png" 
                alt="Mouse House VFX Logo" 
                className="h-10 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
              <span className="font-display font-bold text-xl tracking-tighter">
                MOUSE HOUSE <span className="text-neon-blue">VFX</span>
              </span>
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
              <li><a href="#portfolio" className="hover:text-neon-blue transition-colors">Portfolio</a></li>
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
          <div className="flex gap-8 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
