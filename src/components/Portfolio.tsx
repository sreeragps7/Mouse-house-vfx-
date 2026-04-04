import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const categories = ["All", "Films", "Ads", "CGI", "VFX Breakdown"];

const projects = [
  {
    id: 1,
    title: "Cyberpunk City",
    category: "CGI",
    description: "Full 3D environment build with neon lighting and atmospheric effects.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "The Last Frontier",
    category: "Films",
    description: "Cinematic compositing and set extensions for an epic sci-fi feature.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "Energy Drink Ad",
    category: "Ads",
    description: "High-speed liquid simulations and dynamic motion graphics.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    title: "Dragon Flight Breakdown",
    category: "VFX Breakdown",
    description: "Step-by-step look at the creature animation and fire simulations.",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Neon Nights",
    category: "CGI",
    description: "Futuristic vehicle design and integration into live-action plates.",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    title: "Historical Epic",
    category: "Films",
    description: "Massive crowd simulations and historical architecture recreation.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portfolio" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Our <span className="text-gradient-purple">Portfolio</span>
            </motion.h2>
            <p className="text-gray-400">Explore our latest work across various industries.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-neon-purple text-white neon-glow-purple"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vfx-dark via-vfx-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
                  <span className="text-xs font-mono text-neon-purple mt-3 uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
