import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';
import { journalPosts as staticPosts } from '@/data/journal';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export default function Journal() {
  const [dbPosts, setDbPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    supabase
      .from('journal_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Error fetching Supabase journal posts:', error);
        else if (data && data.length > 0) {
          const formatted = data.map((p) => ({
            slug: p.slug || p.id,
            title: p.title,
            category: p.category,
            date: p.date,
            readTime: p.read_time,
            coverImage: p.cover_image_url,
            excerpt: p.excerpt,
          }));
          setDbPosts(formatted);
        }
      });
  }, []);

  const allPosts = dbPosts.length > 0 ? [...dbPosts, ...staticPosts] : staticPosts;

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title={<>Notes from<br/><span className="italic-serif text-accent">the studio.</span></>}
        image="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=2000&q=80"
        subtitle="Architectural reflections on restraint, material culture, regional climate, and structural honesty."
      />
      <section className="py-24 container-luxe">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {allPosts.map((p, i) => (
            <Reveal key={p.slug + i} delay={(i % 3) * 0.05}>
              <Link to={`/journal/${p.slug}`} className="group block cursor-pointer">
                <div className="aspect-[4/5] overflow-hidden bg-muted mb-6 rounded">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                  />
                </div>
                <div className="eyebrow text-muted-foreground mb-3">{p.category} · {p.date} · {p.readTime}</div>
                <h3 className="font-display text-2xl md:text-3xl leading-tight group-hover:text-accent transition-colors">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{p.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
