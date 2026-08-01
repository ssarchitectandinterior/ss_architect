import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { SplitHeading } from '@/components/site/Reveal';

const heroImages = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
];

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-[#090909] flex flex-col justify-end md:justify-center"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
    >
      {/* Background Image Container */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={heroImages[currentImageIndex]}
            src={heroImages[currentImageIndex]}
            alt="Atelier Norr Architecture Portfolio"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mouse.x * -15,
              y: mouse.y * -15,
            }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              opacity: { duration: 1.5, ease: 'easeInOut' },
              scale: { duration: 6, ease: 'easeOut' },
            }}
            /* On mobile, object-contain ensures 100% of the building render is visible. On desktop (md:), object-cover fills the screen. */
            className="absolute inset-0 w-full h-full object-contain md:object-cover object-center"
          />
        </AnimatePresence>
        
        {/* Soft Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 md:bg-gradient-to-b md:from-black/70 md:via-black/40 md:to-black/80" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 container-luxe text-white pt-24 pb-16 md:py-0">
        <motion.div style={{ opacity }} className="max-w-5xl">
          <h1 className="heading-hero">
            <SplitHeading text="Designing spaces" />
            <br />
            <span className="italic-serif text-accent"><SplitHeading text="that inspire" /></span>{' '}
            <SplitHeading text="generations." />
          </h1>

          {/* Subheading & Buttons positioned cleanly */}
          <div className="mt-6 md:mt-14 space-y-5 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.9 }}
              className="uppercase tracking-[0.2em] font-medium text-white/90 text-[11px] sm:text-xs md:text-sm"
            >
              <span className="text-accent">◆</span>&nbsp;&nbsp;Architecture · Interior · Landscape&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2011
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-8 pt-1"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-4 bg-accent hover:bg-accent/90 text-white border border-white/60 px-8 md:px-10 py-4 md:py-5 uppercase tracking-[0.2em] text-xs md:text-base font-medium transition-transform shadow-lg text-center"
              >
                Explore projects
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center sm:justify-start gap-4 text-white uppercase tracking-[0.2em] text-xs md:text-base font-medium link-underline py-2 sm:py-0"
              >
                Schedule consultation →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-10 right-6 md:right-10 z-20 flex items-center gap-2 md:gap-3">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentImageIndex === idx ? 'w-7 md:w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
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
