import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({
  eyebrow, title, image, subtitle,
}: { eyebrow: string; title: ReactNode; image: string; subtitle?: ReactNode }) {
  return (
    <section className="relative pt-[76px] bg-[#111] text-white overflow-hidden">
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <motion.img
          src={image}
          alt=""
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="relative h-full container-luxe flex flex-col justify-end pb-16">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.9 }} className="eyebrow text-accent mb-6">— {eyebrow}</motion.div>
          <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="heading-hero max-w-5xl">
            {title}
          </motion.h1>
          {subtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.9 }} className="mt-8 max-w-xl text-white/75 text-lg leading-relaxed">{subtitle}</motion.p>}
        </div>
      </div>
    </section>
  );
}
