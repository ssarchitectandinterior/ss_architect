import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin');
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!isSupabaseConfigured()) {
      setError('Supabase credentials are not configured in your .env file.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border p-8 rounded-lg shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="eyebrow text-accent">Studio Admin</div>
          <h1 className="font-display text-3xl tracking-tight">SS Architects &amp; Interiors Portal</h1>
          <p className="text-sm text-muted-foreground">Sign in to manage projects and media assets</p>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="eyebrow text-muted-foreground block mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ssarchitects.com"
              className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-3 text-sm rounded transition-colors"
            />
          </div>

          <div>
            <label className="eyebrow text-muted-foreground block mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-3 text-sm rounded transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background hover:bg-accent hover:text-white transition-colors py-4 uppercase tracking-[0.2em] text-xs font-medium rounded disabled:opacity-50"
          >
            {loading ? 'Authenticating…' : 'Sign In →'}
          </button>
        </form>

        <div className="text-center">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Return to Main Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}
