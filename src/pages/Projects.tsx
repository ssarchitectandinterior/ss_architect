import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film } from 'lucide-react';
import PageHeader from '@/components/site/PageHeader';
import { projects as staticProjects, categories } from '@/data/projects';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export default function Projects() {
  const [cat, setCat] = useState<string>('All');
  const [q, setQ] = useState('');
  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Error loading Supabase projects:', error);
        else if (data && data.length > 0) {
          const formatted = data.map((p) => ({
            slug: p.id,
            title: p.title,
            category: p.category,
            location: p.location,
            year: p.year,
            area: p.client ? `Client: ${p.client}` : '',
            cover: p.image_url,
            video: p.video_url,
            description: p.description,
          }));
          setDbProjects(formatted);
        }
      });
  }, []);

  const allProjects = dbProjects.length > 0 ? dbProjects : staticProjects;

  const filtered = useMemo(() => {
    return allProjects.filter(p => {
      let matchesCat = (cat === 'All');
      if (!matchesCat) {
        const pCat = (p.category || '').trim();
        if (pCat === cat) {
          matchesCat = true;
        } else if (cat === 'Residential Villa' && (pCat === 'Villa' || pCat === 'Residential' || pCat === 'Residential Villa')) {
          matchesCat = true;
        } else if (cat === 'Interiors' && (pCat === 'Interior' || pCat === 'Interiors' || pCat === 'Interior Design')) {
          matchesCat = true;
        }
      }
      const matchesQuery = q === '' || (p.title + p.location + (p.category || '')).toLowerCase().includes(q.toLowerCase());
      return matchesCat && matchesQuery;
    });
  }, [cat, q, allProjects]);

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title={<>Selected <span className="italic-serif text-accent">work.</span></>}
        image="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80"
        subtitle="Explore our completed architecture, interior, and landscape commissions. Integrated with dynamic media assets."
      />

      <section className="py-16 container-luxe">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between mb-12 border-b border-foreground/15 pb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`uppercase tracking-[0.18em] text-[11px] py-2 transition-colors ${cat === c ? 'text-accent' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {c}{cat === c && <span className="ml-2 text-accent">◆</span>}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-3 border-b border-foreground/30 focus-within:border-accent transition-colors py-2 min-w-[240px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search projects…"
              className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
            />
          </label>
        </div>

        <motion.div layout className="grid md:grid-cols-2 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.article
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.04 }}
                className={i % 3 === 0 ? 'md:col-span-2' : ''}
              >
                <Link to={`/projects/${p.slug}`} className="group block">
                  <div className={`overflow-hidden bg-muted relative ${i % 3 === 0 ? 'aspect-[16/9]' : 'aspect-[4/5]'}`}>
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    />
                    {p.video && (
                      <span className="absolute top-4 right-4 bg-black/70 backdrop-blur text-accent px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-mono flex items-center gap-1.5 z-10">
                        <Film size={12} /> Video
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-6">
                    <div>
                      <div className="eyebrow text-muted-foreground mb-2">{p.category} · {p.location}</div>
                      <h3 className="font-display text-3xl group-hover:text-accent transition-colors">{p.title}</h3>
                    </div>
                    <div className="text-right text-sm text-muted-foreground shrink-0">
                      <div>{p.year}</div>
                      <div>{p.area}</div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-muted-foreground font-display text-3xl italic">
            No projects match that search.
          </div>
        )}
      </section>
    </>
  );
}
