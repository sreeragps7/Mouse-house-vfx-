import { motion } from "motion/react";

const steps = [
  {
    id: "01",
    title: "Client Brief",
    description: "Understanding your vision, goals, and project requirements in detail.",
  },
  {
    id: "02",
    title: "Pre-Visualization",
    description: "Creating storyboards and rough animations to map out the cinematic flow.",
  },
  {
    id: "03",
    title: "Production",
    description: "Capturing high-quality plates or generating base 3D assets for the project.",
  },
  {
    id: "04",
    title: "VFX & Compositing",
    description: "The magic happens here. Integrating all elements into a final stunning visual.",
  },
  {
    id: "05",
    title: "Final Delivery",
    description: "Color grading, final rendering, and delivering the project in requested formats.",
  },
];

export default function Workflow() {
  return (
    <section id="workflow" className="py-24 bg-vfx-grey/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our <span className="text-gradient-blue">Workflow</span>
          </motion.h2>
          <p className="text-gray-400">A streamlined process to ensure excellence at every stage.</p>
        </div>

        <div className="relative">
          {/* Vertical line for mobile, horizontal for desktop */}
          <div className="absolute left-8 md:left-0 md:top-1/2 md:w-full h-full md:h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-20" />

          <div className="grid md:grid-cols-5 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16 md:pl-0 md:pt-12 text-left md:text-center"
              >
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 w-16 h-16 rounded-2xl bg-vfx-dark border border-neon-blue/30 flex items-center justify-center text-neon-blue font-display font-bold text-2xl neon-glow-blue">
                  {step.id}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
