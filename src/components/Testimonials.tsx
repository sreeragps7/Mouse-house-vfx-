import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "sreerosh",
    role: "Film Director",
    content: "The level of detail Mouse House VFX brought to our sci-fi project was incredible. They truly understood the cinematic language we were aiming for.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sreerosh",
  },
  {
    name: "Sarah Chen",
    role: "Marketing Head",
    content: "Our commercial needed high-end liquid simulations on a tight deadline. They delivered beyond our expectations. Highly recommended!",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Marcus Thorne",
    role: "Independent Producer",
    content: "Professional, creative, and technically proficient. Their AI-powered pipeline saved us weeks of production time without sacrificing quality.",
    rating: 5,
    image: "https://i.pravatar.cc/150?u=marcus",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Client <span className="text-gradient-purple">Testimonials</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-8 relative"
            >
              <Quote className="absolute top-6 right-8 text-white/5" size={60} />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-neon-purple text-neon-purple" />
                ))}
              </div>
              <p className="text-gray-300 mb-8 italic leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
