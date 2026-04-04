import { motion } from "motion/react";

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              About <span className="text-gradient-purple">Mouse House VFX</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
              <p>
                Mouse House VFX is a creative visual effects studio specializing in cinematic compositing, 
                CGI environments, and high-quality visual effects for films, advertisements, and digital content.
              </p>
              <p>
                Our team uses industry-standard tools such as <span className="text-white font-medium">Nuke</span>, 
                <span className="text-white font-medium"> Blender</span>, and <span className="text-white font-medium">AI-powered pipelines</span> 
                to deliver stunning visuals that push the boundaries of storytelling.
              </p>
              <div className="pt-4 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-3xl font-bold text-white mb-1">100+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Projects Delivered</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white mb-1">10+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Industry Awards</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 neon-glow-purple">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1000"
                alt="VFX Studio Setup"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-neon-purple/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-neon-blue/20 blur-3xl rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
