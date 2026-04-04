import { motion } from "motion/react";
import { Layers, Box, Scissors, Video, Target, Cpu } from "lucide-react";

const services = [
  {
    title: "VFX Compositing",
    description: "Seamlessly blending live-action footage with CGI elements for a photo-realistic finish.",
    icon: Layers,
    color: "neon-blue",
  },
  {
    title: "CGI & 3D Animation",
    description: "Creating stunning 3D environments, characters, and assets from scratch.",
    icon: Box,
    color: "neon-purple",
  },
  {
    title: "Green Screen Keying",
    description: "High-end extraction and integration of subjects from green or blue screen backgrounds.",
    icon: Scissors,
    color: "neon-blue",
  },
  {
    title: "Matchmoving",
    description: "Precise camera tracking to ensure CGI elements perfectly match real-world movement.",
    icon: Target,
    color: "neon-purple",
  },
  {
    title: "Rotoscoping & Cleanup",
    description: "Meticulous frame-by-frame masking and removal of unwanted elements from footage.",
    icon: Video,
    color: "neon-blue",
  },
  {
    title: "AI Cinematic Videos",
    description: "Leveraging cutting-edge AI tools to generate high-quality cinematic content.",
    icon: Cpu,
    color: "neon-purple",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-vfx-grey/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-gradient-blue">Services</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We provide a full suite of visual effects services to bring your most ambitious creative visions to life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-8 group hover:border-neon-blue/50 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${service.color}/10 text-${service.color} group-hover:scale-110 transition-transform`}>
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
