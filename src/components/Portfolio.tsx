import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import {
  Film,
  Sparkles,
  Eye,
  X,
  Clapperboard,
  Download,
  Calendar,
  User,
  Camera,
  RotateCcw,
  Check,
  ShieldCheck,
} from "lucide-react";
import paithalattamPoster from "../assets/images/paithalattam.jpg";
import EditPosterModal, { resolveImageUrl } from "./EditPosterModal";
import { useStudioAdmin } from "../context/AdminContext";
import AdminFloatingBar from "./AdminFloatingBar";

export interface FilmPoster {
  id: string;
  title: string;
  director?: string;
  vfx: string;
  tagline?: string;
  description?: string;
  image: string;
  year: string;
  badge: string;
}

// Exactly the 3 theatrical film posters with official high-res artworks
export const DEFAULT_POSTERS: FilmPoster[] = [
  {
    id: "oru-parvai-pothum",
    title: "Oru Parvai Pothum",
    vfx: "Mouse House VFX",
    tagline: "A Sreerosh Film • Official First Look",
    image: "/oru-parvai-pothum.png",
    year: "2024",
    badge: "Official Poster",
  },
  {
    id: "paithalattam",
    title: "Paithalattam (പൈതലോട്ടം)",
    director: "Sreerosh",
    vfx: "Mouse House VFX",

    image: paithalattamPoster,
    year: "2025",
    badge: "Winner • Best Film",
  },
  {
    id: "shadows-calicut",
    title: "vennilavai vanthale",
    director: "Sreerosh",
    vfx: "Mouse House VFX",
    tagline: "Dark Crime Neo-Noir Thriller",
    description:
      "Atmospheric crime thriller featuring complex rainy day CGI, digital blood simulations, and set extensions.",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=900",
    year: "2025",
    badge: "Official Selection",
  },
];

const STORAGE_KEY = "mousehouse_film_posters_v2";

export default function Portfolio() {
  const { isAdmin } = useStudioAdmin();

  const [posters, setPosters] = useState<FilmPoster[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, Partial<FilmPoster>>;
        return DEFAULT_POSTERS.map((def) => {
          const override = parsed[def.id];
          if (override) {
            return {
              ...def,
              ...override,
              image: override.image ? resolveImageUrl(override.image).url : def.image,
            };
          }
          return def;
        });
      }
    } catch (e) {
      console.warn("Could not read saved posters:", e);
    }
    return DEFAULT_POSTERS;
  });

  const [selectedPoster, setSelectedPoster] = useState<FilmPoster | null>(null);
  const [editingPoster, setEditingPoster] = useState<FilmPoster | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync selected poster if it's currently open in lightbox
  useEffect(() => {
    if (selectedPoster) {
      const updated = posters.find((p) => p.id === selectedPoster.id);
      if (updated) setSelectedPoster(updated);
    }
  }, [posters]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSavePoster = (updatedPoster: FilmPoster) => {
    const newPosters = posters.map((p) => (p.id === updatedPoster.id ? updatedPoster : p));
    setPosters(newPosters);

    // Save to localStorage
    try {
      const overrides: Record<string, Partial<FilmPoster>> = {};
      newPosters.forEach((p) => {
        const def = DEFAULT_POSTERS.find((d) => d.id === p.id);
        if (def && JSON.stringify(p) !== JSON.stringify(def)) {
          overrides[p.id] = p;
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.error("Failed to save poster to localStorage:", e);
    }

    showToast(`"${updatedPoster.title}" poster updated successfully!`);
  };

  const handleResetPoster = (posterId: string) => {
    const def = DEFAULT_POSTERS.find((d) => d.id === posterId);
    if (!def) return;

    const newPosters = posters.map((p) => (p.id === posterId ? def : p));
    setPosters(newPosters);

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        delete parsed[posterId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (e) {
      console.error(e);
    }

    showToast(`Reset "${def.title}" to default official artwork.`);
  };

  const handleResetAll = () => {
    if (confirm("Reset all 3 posters back to the original Mouse House VFX defaults?")) {
      setPosters(DEFAULT_POSTERS);
      localStorage.removeItem(STORAGE_KEY);
      showToast("All posters have been reset to default!");
    }
  };

  return (
    <section id="works" className="py-24 relative overflow-hidden">
      {/* Anchor for backward compatibility with #portfolio */}
      <div id="portfolio" className="absolute -top-10" />

      {/* Atmospheric Lighting Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-neon-purple/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-blue/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-neon-blue text-vfx-dark font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <Check size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-neon-blue uppercase shadow-sm">
              <Clapperboard size={13} />
              <span>Cinema &amp; Visual Effects</span>
            </div>

            {/* Admin-only quick edit badge (Hidden from public) */}
            {isAdmin && (
              <button
                onClick={() => setEditingPoster(posters[0])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neon-blue/20 hover:bg-neon-blue hover:text-vfx-dark border border-neon-blue/40 text-xs font-semibold text-neon-blue transition-all shadow-sm"
                title="Studio Owner: Click to edit or replace poster artwork"
              >
                <ShieldCheck size={13} />
                <span>Admin: Edit Posters</span>
              </button>
            )}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight"
          >
            Our <span className="text-gradient-purple">Works</span>
          </motion.h2>

          <p className="mt-3 text-sm text-gray-400 max-w-xl mx-auto">
            Award-winning theatrical titles and visual effects. Click on any poster to view full credits and details.
          </p>
        </div>

        {/* Film Posters Grid (Exactly the 3 Posters, 2:3 Vertical Theatrical Ratio) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {posters.map((poster, index) => {
            const defaultArtwork = DEFAULT_POSTERS.find((d) => d.id === poster.id);

            return (
              <motion.div
                key={poster.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={() => setSelectedPoster(poster)}
                className="group relative rounded-2xl overflow-hidden bg-vfx-card/40 border border-white/10 hover:border-neon-blue/60 hover:shadow-[0_0_35px_rgba(0,210,255,0.25)] transition-all duration-500 flex flex-col cursor-pointer select-none"
              >
                {/* Theatrical Poster Frame 2:3 Aspect */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/60">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      if (defaultArtwork && e.currentTarget.src !== defaultArtwork.image) {
                        e.currentTarget.src = defaultArtwork.image;
                      }
                    }}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Top Film Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-wider uppercase text-neon-blue font-bold shadow-md">
                      {poster.badge}
                    </span>
                  </div>

                  {/* Admin-only 'Change' quick button in Top Right (Hidden from public) */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPoster(poster);
                      }}
                      className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-md bg-black/85 hover:bg-neon-blue hover:text-vfx-dark text-neon-blue border border-neon-blue/40 text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md"
                      title="Studio Owner: Change this poster image"
                    >
                      <Camera size={12} />
                      <span>Change</span>
                    </button>
                  )}

                  {/* Shimmer / Gloss Light Reflection Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Hover Quick Action */}
                  <div className="absolute inset-0 bg-gradient-to-t from-vfx-dark via-vfx-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10">
                    <div className="flex items-center justify-between text-xs text-neon-blue font-semibold mb-3">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Clapperboard size={13} />
                        {poster.year}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium transition-colors">
                          <Eye size={12} />
                          View
                        </span>
                      </div>
                    </div>

                    {poster.description && (
                      <p className="text-xs text-gray-200 line-clamp-2 mb-3 font-light leading-relaxed">
                        {poster.description}
                      </p>
                    )}

                    <div className="pt-2.5 border-t border-white/15 text-[11px] text-gray-400 flex flex-col gap-1 font-mono">
                      {poster.director && (
                        <span>
                          <strong className="text-white">Director:</strong> {poster.director}
                        </span>
                      )}
                      <span>
                        <strong className="text-neon-blue">VFX:</strong> {poster.vfx}
                      </span>
                    </div>

                    {/* Admin-only Change Poster Artwork on Hover (Hidden from public) */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPoster(poster);
                        }}
                        className="mt-3 w-full py-2 rounded-xl bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-vfx-dark border border-neon-blue/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <Camera size={13} />
                        <span>Change Poster Artwork</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Poster Caption / Footer Info below image */}
                <div className="p-5 bg-vfx-card/90 border-t border-white/5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors line-clamp-1">
                      {poster.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                      {poster.tagline || (poster.director ? `A film by ${poster.director}` : poster.vfx)}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>{poster.director || poster.vfx}</span>
                    <span className="text-neon-purple font-semibold">{poster.year}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Admin-only Global Reset Option (Hidden from public) */}
        {isAdmin && (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors underline-offset-4 hover:underline"
            >
              <RotateCcw size={12} />
              <span>Reset all posters to original defaults</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Admin Status Bar for logged-in studio owner */}
      <AdminFloatingBar onOpenEditor={() => setEditingPoster(posters[0])} />

      {/* EDIT POSTER MODAL (Studio Owner Only) */}
      <AnimatePresence>
        {isAdmin && editingPoster && (
          <EditPosterModal
            poster={editingPoster}
            defaultPoster={
              DEFAULT_POSTERS.find((d) => d.id === editingPoster.id) || editingPoster
            }
            onSave={(updated) => {
              handleSavePoster(updated);
            }}
            onReset={(posterId) => {
              handleResetPoster(posterId);
            }}
            onClose={() => setEditingPoster(null)}
          />
        )}
      </AnimatePresence>

      {/* FULL SCREEN LIGHTBOX / POSTER VIEWER */}
      <AnimatePresence>
        {selectedPoster && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedPoster(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-vfx-card border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPoster(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
                title="Close"
              >
                <X size={20} />
              </button>

              {/* Poster Image (Left / Top) */}
              <div className="md:w-1/2 bg-black flex items-center justify-center p-4 relative overflow-hidden">
                <div className="w-full max-w-sm aspect-[2/3] rounded-xl overflow-hidden border border-white/20 shadow-2xl relative">
                  <img
                    src={selectedPoster.image}
                    alt={selectedPoster.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const def = DEFAULT_POSTERS.find((d) => d.id === selectedPoster.id);
                      if (def && e.currentTarget.src !== def.image) {
                        e.currentTarget.src = def.image;
                      }
                    }}
                    className="w-full h-full object-contain bg-black"
                  />
                </div>
              </div>

              {/* Poster Details & Credits Block (Right / Bottom) */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-neon-blue uppercase mb-3">
                    <Film size={12} />
                    <span>{selectedPoster.badge}</span>
                  </div>

                  <h2 className="text-3xl font-black text-white tracking-tight mb-1">
                    {selectedPoster.title}
                  </h2>
                  <p className="text-neon-purple font-medium text-sm mb-4">
                    {selectedPoster.tagline}
                  </p>

                  {selectedPoster.description && (
                    <div className="space-y-3 mb-6 text-sm text-gray-300">
                      <p className="leading-relaxed">{selectedPoster.description}</p>
                    </div>
                  )}

                  {/* Cinema Billing Block */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs font-mono">
                    {selectedPoster.director && (
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-gray-500 uppercase flex items-center gap-1.5">
                          <User size={12} />
                          Directed By:
                        </span>
                        <span className="text-white font-bold">{selectedPoster.director}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-500 uppercase flex items-center gap-1.5">
                        <Sparkles size={12} />
                        Visual Effects:
                      </span>
                      <span className="text-neon-blue font-bold">{selectedPoster.vfx}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 uppercase flex items-center gap-1.5">
                        <Calendar size={12} />
                        Release Year:
                      </span>
                      <span className="text-white font-semibold">{selectedPoster.year}</span>
                    </div>
                  </div>
                </div>

                {/* Lightbox Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Admin-only Change button inside lightbox */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          const current = selectedPoster;
                          setSelectedPoster(null);
                          setEditingPoster(current);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-neon-blue/20 hover:bg-neon-blue hover:text-vfx-dark text-neon-blue border border-neon-blue/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Camera size={14} />
                        <span>Change Poster</span>
                      </button>
                    )}

                    <a
                      href={selectedPoster.image}
                      download={`${selectedPoster.title}-poster`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download size={14} />
                      <span>Open</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedPoster(null)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
