import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="min-h-[85vh] pt-[76px] flex items-center justify-center bg-background">
      <div className="container-luxe text-center">
        <div className="eyebrow text-accent mb-6">— 404</div>
        <h1 className="heading-hero">Nothing <span className="italic-serif">here.</span></h1>
        <p className="mt-8 text-muted-foreground text-lg max-w-md mx-auto">
          The page you were looking for has moved, or perhaps never existed. Return to the studio.
        </p>
        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-4 bg-accent hover:bg-accent/90 text-white border border-white/60 px-10 py-5 uppercase tracking-[0.2em] text-xs"
        >
          Back to home →
        </Link>
      </div>
    </section>
  );
}
