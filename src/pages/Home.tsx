import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { SplitHeading } from '@/components/site/Reveal';

const heroImg = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85';

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  return (
    <section
      ref={ref}
      className="relative h-[100svh] overflow-hidden bg-[#111111]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
    >
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <motion.img
          src={heroImg}
          alt="Contemporary concrete residence at dusk with warm interior light"
          className="w-full h-full object-cover ken-burns"
          animate={{ x: mouse.x * -20, y: mouse.y * -20 }}
          transition={{ type: 'spring', stiffness: 40, damping: 20 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center container-luxe text-white">
        <div className="max-w-5xl">
          <h1 className="heading-hero">
            <SplitHeading text="Designing spaces" />
            <br />
            <span className="italic-serif text-accent"><SplitHeading text="that inspire" /></span>{' '}
            <SplitHeading text="generations." />
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.9 }}
            className="mt-12 uppercase tracking-[0.2em] font-medium text-white/80 text-xs md:text-sm"
          >
            <span className="text-accent">◆</span>&nbsp;&nbsp;Architecture · Interior · Landscape&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2011
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mt-6 max-w-2xl text-white/90 text-xl md:text-2xl font-light leading-relaxed"
          >
            Architecture and interior design crafted with precision, restraint and a slow attention to material.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.9 }}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8"
          >
            <Link
              to="/projects"
              className="group inline-flex items-center gap-4 bg-accent hover:bg-accent/90 text-white border border-white/60 px-10 py-5 uppercase tracking-[0.2em] text-sm md:text-base font-medium transition-transform"
            >
              Explore projects
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-4 text-white uppercase tracking-[0.2em] text-sm md:text-base font-medium link-underline"
            >
              Schedule consultation →
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default function Home() {
  useEffect(() => {
    document.title = 'Atelier Norr — Architecture & Interior Design';
  }, []);
  return (
    <>
      <Hero />
    </>
  );
}
