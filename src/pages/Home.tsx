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
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
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
      className="relative h-[100svh] overflow-hidden bg-[#111111]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
      }}
    >
      {/* Background Image Carousel with Smooth Transitions */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={heroImages[currentImageIndex]}
            src={heroImages[currentImageIndex]}
            alt="Atelier Norr Architecture Portfolio"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1, x: mouse.x * -20, y: mouse.y * -20 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{
              opacity: { duration: 1.8, ease: 'easeInOut' },
              scale: { duration: 8, ease: 'easeOut' },
              x: { type: 'spring', stiffness: 40, damping: 20 },
              y: { type: 'spring', stiffness: 40, damping: 20 },
            }}
            className="absolute inset-0 w-full h-full object-cover ken-burns"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />
      </motion.div>

      {/* Hero Content */}
      <motion.div style={{ opacity }} className="relative z-10 h-full flex flex-col justify-center container-luxe text-white">
        <div className="max-w-5xl">
          <h1 className="heading-hero">
            <SplitHeading text="Designing spaces" />
            <br />
            <span className="italic-serif text-accent"><SplitHeading text="that inspire" /></span>{' '}
            <SplitHeading text="generations." />
          </h1>

          {/* Subheading & Buttons positioned with clean spacing */}
          <div className="mt-14 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9 }}
              className="uppercase tracking-[0.22em] font-medium text-white/90 text-xs md:text-sm"
            >
              <span className="text-accent">◆</span>&nbsp;&nbsp;Architecture · Interior · Landscape&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2011
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.9 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 pt-2"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-4 bg-accent hover:bg-accent/90 text-white border border-white/60 px-10 py-5 uppercase tracking-[0.2em] text-sm md:text-base font-medium transition-transform shadow-lg"
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
        </div>
      </motion.div>

      {/* Slide Indicators at Bottom Right */}
      <div className="absolute bottom-10 right-10 z-20 flex items-center gap-3">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              currentImageIndex === idx ? 'w-8 bg-accent' : 'w-2 bg-white/40 hover:bg-white/70'
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
