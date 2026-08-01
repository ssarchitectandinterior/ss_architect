import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/studio', label: 'Studio' },
  { to: '/projects', label: 'Projects' },
  { to: '/services', label: 'Services' },
  { to: '/process', label: 'Process' },
  { to: '/journal', label: 'Journal' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const overHero = pathname === '/' && !scrolled;

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Temporarily hide header so elementFromPoint can see the content behind
      const header = headerRef.current;
      if (header) {
        header.style.pointerEvents = 'none';
        header.style.visibility = 'hidden';
      }

      const headerMid = 38;
      const el = document.elementFromPoint(window.innerWidth / 2, headerMid);

      // Restore header immediately
      if (header) {
        header.style.pointerEvents = '';
        header.style.visibility = '';
      }

      if (el) {
        let node: HTMLElement | null = el as HTMLElement;
        let dark = false;
        while (node && node !== document.body) {
          const bg = getComputedStyle(node).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            const match = bg.match(/\d+/g);
            if (match) {
              const [r, g, b] = match.map(Number);
              if ((r * 0.299 + g * 0.587 + b * 0.114) < 80) {
                dark = true;
              }
            }
            break;
          }
          node = node.parentElement;
        }
        // Also check if there's a background image (hero sections with images)
        if (!dark) {
          let imgNode: HTMLElement | null = el as HTMLElement;
          while (imgNode && imgNode !== document.body) {
            const bgImg = getComputedStyle(imgNode).backgroundImage;
            if (bgImg && bgImg !== 'none') {
              // Pages with background images over dark sections
              const parentBg = getComputedStyle(imgNode).backgroundColor;
              const parentMatch = parentBg?.match(/\d+/g);
              if (parentMatch) {
                const [r, g, b] = parentMatch.map(Number);
                if ((r * 0.299 + g * 0.587 + b * 0.114) < 80) {
                  dark = true;
                }
              }
              break;
            }
            imgNode = imgNode.parentElement;
          }
        }
        setOverDark(dark);
      }
    };

    // Run detection after a small delay to let page render
    const timer = setTimeout(onScroll, 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,color,border-color] duration-500 ${
          scrolled
            ? 'bg-[#090909]/80 backdrop-blur-xl border-b border-white/10 text-white'
            : pathname === '/'
              ? 'bg-gradient-to-b from-black/60 to-transparent text-white drop-shadow-md'
              : 'bg-transparent text-foreground'
        }`}
      >
        <div className="container-luxe flex items-center justify-between h-[76px]">
          <Link to="/" className="flex items-center gap-3 group" aria-label="Atelier Norr — home">
            <span className="font-display text-2xl tracking-tight leading-none">
              Atelier <span className="italic-serif">Norr</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-9" aria-label="Primary">
            {nav.slice(1, -1).map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `text-[13px] tracking-[0.14em] uppercase link-underline ${
                    isActive ? 'text-accent' : ''
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-3 border border-white/60 text-white hover:border-accent hover:text-accent transition-colors px-5 py-2.5 text-[12px] uppercase tracking-[0.2em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Book Consultation
            </Link>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[70] bg-[#111]"
            initial={{ clipPath: 'circle(0% at 92% 6%)' }}
            animate={{ clipPath: 'circle(150% at 92% 6%)' }}
            exit={{ clipPath: 'circle(0% at 92% 6%)' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="container-luxe h-full flex flex-col text-[#F6F6F4]">
              <div className="flex items-center justify-between h-[76px]">
                <span className="font-display text-2xl">Atelier <span className="italic-serif">Norr</span></span>
                <button aria-label="Close menu" onClick={() => setOpen(false)} className="w-11 h-11 inline-flex items-center justify-center">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 flex flex-col justify-center gap-4" aria-label="Mobile">
                {nav.map((n, i) => (
                  <motion.div
                    key={n.to}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={n.to}
                      className="block font-display text-5xl md:text-7xl leading-[1.05] hover:text-accent transition-colors"
                    >
                      {n.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-[#F6F6F4]/70 border-t border-white/10">
                <div>
                  <div className="eyebrow text-accent mb-2">Studio</div>
                  12 Kala Ghoda Lane<br/>Mumbai 400001, India
                </div>
                <div>
                  <div className="eyebrow text-accent mb-2">Contact</div>
                  hello@ateliernorr.com<br/>+91 22 4890 2200
                </div>
                <div>
                  <div className="eyebrow text-accent mb-2">Follow</div>
                  Instagram · LinkedIn · Pinterest
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
