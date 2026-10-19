import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, KeyRound, X, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { useStudioAdmin } from "../context/AdminContext";

export default function AdminAuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, isAdmin, logout } = useStudioAdmin();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setPasscode("");
      setError(false);
      setSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!passcode) return;

    const ok = login(passcode);
    if (ok) {
      setSuccess(true);
      setError(false);
    } else {
      setError(true);
      setSuccess(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={closeAuthModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-md w-full bg-vfx-card border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle glow background */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-neon-blue/15 blur-3xl rounded-full pointer-events-none" />

          {/* Close */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center text-neon-blue mb-5 shadow-lg">
            {isAdmin ? <ShieldCheck size={28} /> : <Lock size={28} />}
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight mb-1">
            {isAdmin ? "Studio Admin Active" : "Studio Owner Access"}
          </h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            {isAdmin
              ? "You are currently logged in with owner permissions to customize theatrical posters and details."
              : "This area is private for the studio owner (Sreerosh / Mouse House VFX) to customize poster artworks."}
          </p>

          {isAdmin ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-neon-blue/10 border border-neon-blue/30 text-xs text-neon-blue font-medium flex items-center gap-2">
                <Check size={16} />
                <span>Admin mode is active. Poster editing controls are now visible to you.</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={logout}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-white font-bold text-xs transition-colors"
                >
                  Exit / Lock Admin
                </button>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="flex-1 py-3 rounded-xl bg-neon-blue text-vfx-dark font-bold text-xs hover:bg-neon-blue/90 transition-colors shadow-lg"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                  Enter Studio Passcode
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="password"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setError(false);
                    }}
                    placeholder="Enter passcode (e.g. mousehouse)"
                    className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                      error
                        ? "border-red-500/80 focus:border-red-500"
                        : "border-white/20 focus:border-neon-blue"
                    }`}
                  />
                  <KeyRound
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Incorrect passcode. Hint: Use <strong>mousehouse</strong> or <strong>sreerosh</strong></span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300">
                  <Check size={14} className="shrink-0" />
                  <span>Passcode accepted! Unlocking Studio Admin...</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-neon-blue hover:bg-neon-blue/90 text-vfx-dark font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Lock size={14} />
                  <span>Unlock Admin</span>
                </button>
              </div>

              <div className="pt-3 border-t border-white/10 text-center">
                <p className="text-[11px] text-gray-400">
                  Shortcut: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">Shift</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">A</kbd> anytime
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
