import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { SplitHeading } from '@/components/site/Reveal';

const desktopHeroImages = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
];

const mobileHeroImages = [
  '/hero/hero-mobile-1.jpg',
  '/hero/hero-mobile-2.jpg',
  '/hero/hero-mobile-3.jpg',
];

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentImageSrc = isMobile ? mobileHeroImages[currentImageIndex] : desktopHeroImages[currentImageIndex];

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[100svh] overflow-hidden bg-[#090909]"
      onMouseMove={(e) => {
        if (!isMobile) {
          const r = e.currentTarget.getBoundingClientRect();
          setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
        }
      }}
    >
      {/* Background Image Carousel with Responsive Mobile & Laptop Images */}
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentImageSrc}
            src={currentImageSrc}
            alt="Atelier Norr Architecture & Interior Portfolio"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: isMobile ? 0 : mouse.x * -20,
              y: isMobile ? 0 : mouse.y * -20,
            }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{
              opacity: { duration: 1.8, ease: 'easeInOut' },
              scale: { duration: 7, ease: 'easeOut' },
              x: { type: 'spring', stiffness: 40, damping: 20 },
              y: { type: 'spring', stiffness: 40, damping: 20 },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.88] ken-burns"
          />
        </AnimatePresence>

        {/* Dark Vignette Overlay - Enhanced for mobile bottom text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/85 md:from-black/60 md:via-black/30 md:to-black/75" />
      </motion.div>

      {/* Hero Content - Positioned at bottom on mobile (justify-end pb-20) to reveal full image */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col justify-end md:justify-center pb-20 md:pb-0 container-luxe text-white"
      >
        <div className="max-w-5xl">
          <h1 className="heading-hero">
            <SplitHeading text="Designing spaces" />
            <br />
            <span className="italic-serif text-accent"><SplitHeading text="that inspire" /></span>{' '}
            <SplitHeading text="generations." />
          </h1>

          {/* Subheading & Buttons positioned cleanly at the bottom */}
          <div className="mt-5 md:mt-14 space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9 }}
              className="uppercase tracking-[0.2em] font-medium text-white/90 text-xs md:text-sm"
            >
              <span className="text-accent">◆</span>&nbsp;&nbsp;Architecture · Interior · Landscape&nbsp;&nbsp;·&nbsp;&nbsp;Est. 2011
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.9 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 md:gap-8 pt-1 md:pt-2"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center justify-center gap-4 bg-accent hover:bg-accent/90 text-white border border-white/60 px-8 md:px-10 py-3.5 md:py-5 uppercase tracking-[0.2em] text-xs md:text-base font-medium transition-transform shadow-lg w-full sm:w-auto text-center"
              >
                Explore projects
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-4 text-white uppercase tracking-[0.2em] text-xs md:text-base font-medium link-underline pt-1 sm:pt-0"
              >
                Schedule consultation →
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Slide Indicators at Bottom Right */}
      <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 z-20 flex items-center gap-2.5 md:gap-3">
        {[0, 1, 2].map((idx) => (
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
