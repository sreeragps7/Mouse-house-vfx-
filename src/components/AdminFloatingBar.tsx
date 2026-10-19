import { motion, AnimatePresence } from "motion/react";
import { Shield, Lock, Sliders, ExternalLink } from "lucide-react";
import { useStudioAdmin } from "../context/AdminContext";

interface AdminFloatingBarProps {
  onOpenEditor?: () => void;
}

export default function AdminFloatingBar({ onOpenEditor }: AdminFloatingBarProps) {
  const { isAdmin, logout } = useStudioAdmin();

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Studio Admin Controls"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 max-w-sm"
      >
        <div className="flex items-center gap-2 p-2 pl-3.5 rounded-2xl bg-vfx-card/95 border border-neon-blue/50 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,210,255,0.25)] text-xs">
          <div className="flex items-center gap-2 mr-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white flex items-center gap-1.5">
              <Shield size={14} className="text-neon-blue" />
              <span>Studio Admin</span>
            </span>
          </div>

          {onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="px-2.5 py-1.5 rounded-xl bg-neon-blue/15 hover:bg-neon-blue text-neon-blue hover:text-vfx-dark font-semibold transition-all flex items-center gap-1"
              title="Open poster customizer"
            >
              <Sliders size={13} />
              <span>Edit Posters</span>
            </button>
          )}

          <a
            href="#works"
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Scroll to works"
          >
            <ExternalLink size={13} />
          </a>

          <button
            onClick={logout}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 font-medium transition-colors flex items-center gap-1"
            title="Lock and view as public visitor"
          >
            <Lock size={12} />
            <span>Lock</span>
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
