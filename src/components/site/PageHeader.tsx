import { ReactNode } from 'react';
import { motion } from 'framer-motion';

export default function PageHeader({
  eyebrow, title, image, subtitle, objectPosition = 'center', overlayClassName,
}: {
  eyebrow: string;
  title: ReactNode;
  image: string;
  subtitle?: ReactNode;
  objectPosition?: string;
  overlayClassName?: string;
}) {
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
          style={{ objectPosition }}
        />
        <div className={overlayClassName ?? "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30"} />
        <div className="relative h-full container-luxe flex flex-col justify-end pb-16">
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.9 }} className="eyebrow text-accent mb-6 drop-shadow-md">— {eyebrow}</motion.div>
          <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="heading-hero max-w-5xl drop-shadow-lg">
            {title}
          </motion.h1>
          {subtitle && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.9 }} className="mt-8 max-w-xl text-white/90 text-lg leading-relaxed drop-shadow-md">{subtitle}</motion.p>}
        </div>
      </div>
    </section>
  );
}
