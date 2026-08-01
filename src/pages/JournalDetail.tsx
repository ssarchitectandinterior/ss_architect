import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '@/components/site/Reveal';
import { journalPosts as staticPosts } from '@/data/journal';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export default function JournalDetail() {
  const { slug } = useParams();
  const [dbPost, setDbPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured() || !slug) {
      setLoading(false);
      return;
    }

    const fetchArticle = async () => {
      try {
        // 1. Try querying by slug
        let { data, error } = await supabase
          .from('journal_posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        // 2. If not found by slug and slug looks like a UUID, try querying by id
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
        if (!data && isUuid) {
          const res = await supabase
            .from('journal_posts')
            .select('*')
            .eq('id', slug)
            .maybeSingle();
          data = res.data;
          error = res.error;
        }

        if (!error && data) {
          const contentObj = typeof data.content === 'object' ? data.content : {};
          setDbPost({
            slug: data.slug || data.id,
            title: data.title,
            category: data.category,
            date: data.date,
            readTime: data.read_time,
            author: {
              name: data.author_name,
              role: data.author_role,
              avatar: data.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            },
            coverImage: data.cover_image_url,
            excerpt: data.excerpt,
            content: {
              intro: contentObj?.intro || data.excerpt,
              sections: contentObj?.sections || [],
              conclusion: contentObj?.conclusion,
            },
          });
        }
      } catch (err) {
        console.error('Error fetching journal post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const post = dbPost || staticPosts.find((p) => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading article…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl">Article Not Found</h1>
          <p className="text-muted-foreground text-sm">The journal entry you are looking for does not exist.</p>
          <Link to="/journal" className="inline-block uppercase tracking-[0.2em] text-xs link-underline pt-2">
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const related = staticPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-[76px] bg-[#111] text-white">
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="relative h-full container-luxe flex flex-col justify-end pb-16">
            <div className="max-w-4xl space-y-4">
              <div className="eyebrow text-accent">
                {post.category} · {post.date} · {post.readTime}
              </div>
              <h1 className="font-display text-4xl md:text-6xl leading-[1.1] text-foreground">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main Reading Container */}
      <section className="py-16 md:py-24 container-luxe">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Author & Meta Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start space-y-8 border-b lg:border-b-0 lg:border-r border-border pb-8 lg:pb-0 lg:pr-8">
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-14 h-14 rounded-full object-cover border border-accent/40"
              />
              <div>
                <h4 className="font-display text-lg leading-tight">{post.author.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{post.author.role}</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-muted-foreground uppercase tracking-widest pt-4 border-t border-border">
              <div>
                <span className="block text-[10px] text-accent mb-1">Published</span>
                <span className="text-foreground">{post.date}</span>
              </div>
              <div>
                <span className="block text-[10px] text-accent mb-1">Topic</span>
                <span className="text-foreground">{post.category}</span>
              </div>
              <div>
                <span className="block text-[10px] text-accent mb-1">Reading Duration</span>
                <span className="text-foreground">{post.readTime}</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent hover:text-foreground transition-colors"
              >
                ← All Essays
              </Link>
            </div>
          </aside>

          {/* Article Body */}
          <article className="lg:col-span-8 space-y-12">
            {/* Lead Excerpt / Intro */}
            {post.content?.intro && (
              <Reveal>
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground italic border-l-2 border-accent pl-6 py-2">
                  "{post.content.intro}"
                </p>
              </Reveal>
            )}

            {/* Sections */}
            {post.content?.sections && post.content.sections.map((section: any, idx: number) => (
              <Reveal key={idx} delay={idx * 0.05}>
                <div className="space-y-6 pt-6 border-t border-border/60">
                  {section.heading && (
                    <h2 className="font-display text-2xl md:text-3xl text-foreground">
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs && section.paragraphs.map((pText: string, pIdx: number) => (
                    <p key={pIdx} className="text-lg text-muted-foreground leading-relaxed font-sans">
                      {pText}
                    </p>
                  ))}

                  {/* Pull Quote */}
                  {section.quote && (
                    <blockquote className="my-10 bg-card border border-accent/30 p-8 rounded-lg">
                      <p className="font-display text-xl md:text-2xl text-accent italic leading-snug">
                        "{section.quote}"
                      </p>
                    </blockquote>
                  )}

                  {/* Inline Section Image */}
                  {section.image && (
                    <figure className="my-10 space-y-3">
                      <div className="aspect-[16/10] overflow-hidden rounded bg-muted">
                        <img
                          src={section.image}
                          alt={section.caption || post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {section.caption && (
                        <figcaption className="text-xs text-muted-foreground italic text-center">
                          {section.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              </Reveal>
            ))}

            {/* Conclusion */}
            {post.content?.conclusion && (
              <Reveal>
                <div className="pt-8 border-t border-border space-y-4">
                  <h3 className="eyebrow text-accent">Concluding Reflection</h3>
                  <p className="font-display text-xl leading-relaxed text-foreground">
                    {post.content.conclusion}
                  </p>
                </div>
              </Reveal>
            )}
          </article>
        </div>
      </section>

      {/* Related Essays */}
      <section className="py-20 bg-card/50 border-t border-border">
        <div className="container-luxe space-y-12">
          <div className="flex items-end justify-between border-b border-border pb-6">
            <div>
              <div className="eyebrow text-accent mb-2">Further Reading</div>
              <h3 className="font-display text-3xl">More from the studio</h3>
            </div>
            <Link to="/journal" className="text-xs uppercase tracking-[0.2em] link-underline">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link key={r.slug} to={`/journal/${r.slug}`} className="group block space-y-4">
                <div className="aspect-[4/5] overflow-hidden bg-muted rounded">
                  <img
                    src={r.coverImage}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="eyebrow text-muted-foreground text-xs">
                  {r.category} · {r.date}
                </div>
                <h4 className="font-display text-xl group-hover:text-accent transition-colors leading-snug">
                  {r.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
