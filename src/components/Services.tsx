import { motion } from "motion/react";
import { Layers, Box, Paintbrush, Music } from "lucide-react";

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
    title: "Paint & Prep",
    description: "Meticulous wire removal, plate cleanup, marker extraction, and clean plate creation ready for compositing.",
    icon: Paintbrush,
    color: "neon-blue",
  },
  {
    title: "Lyrical Videos",
    description: "Stylized typography animations, dynamic motion graphics, and engaging visual storytelling synced to music tracks.",
    icon: Music,
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.color === "neon-purple"
                    ? "bg-neon-purple/10 text-neon-purple"
                    : "bg-neon-blue/10 text-neon-blue"
                } group-hover:scale-110 transition-transform`}
              >
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
