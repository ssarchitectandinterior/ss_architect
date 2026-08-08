import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, LogOut, Film, Image as ImageIcon, CheckCircle, AlertCircle, X, Images, BookOpen, Layers } from 'lucide-react';
import { projects as staticProjects, categoryOptions } from '@/data/projects';
import { journalPosts as staticJournalPosts } from '@/data/journal';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  client: string | null;
  location: string;
  year: string;
  area: string | null;
  duration: string | null;
  services: string | null;
  materials: string | null;
  description: string | null;
  challenges: string | null;
  solution: string | null;
  image_url: string;
  video_url: string | null;
  gallery_urls?: string[];
  created_at?: string;
  isStatic?: boolean;
}

interface JournalItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  read_time: string;
  author_name: string;
  author_role: string;
  author_avatar: string | null;
  cover_image_url: string;
  excerpt: string;
  content: any;
  created_at?: string;
  isStatic?: boolean;
}

interface JournalSectionForm {
  heading: string;
  body: string;
  quote: string;
  image: string;
}

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'journal'>('projects');

  // Data list states
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [journalPosts, setJournalPosts] = useState<JournalItem[]>([]);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Project Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Residential');
  const [client, setClient] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [area, setArea] = useState('');
  const [duration, setDuration] = useState('');
  const [services, setServices] = useState('');
  const [materials, setMaterials] = useState('');
  const [description, setDescription] = useState('');
  const [challenges, setChallenges] = useState('');
  const [solution, setSolution] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [customGalleryInput, setCustomGalleryInput] = useState('');

  // Journal Modal State
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [editingJournalId, setEditingJournalId] = useState<string | null>(null);

  // Journal Form State
  const [journalTitle, setJournalTitle] = useState('');
  const [journalCategory, setJournalCategory] = useState('Essay');
  const [journalDate, setJournalDate] = useState('Jun 2026');
  const [journalReadTime, setJournalReadTime] = useState('6 min read');
  const [journalAuthorName, setJournalAuthorName] = useState('Aditya & Norah Sen');
  const [journalAuthorRole, setJournalAuthorRole] = useState('Principal Architects');
  const [journalCoverImage, setJournalCoverImage] = useState('');
  const [journalExcerpt, setJournalExcerpt] = useState('');
  const [journalIntro, setJournalIntro] = useState('');
  const [journalConclusion, setJournalConclusion] = useState('');

  // Dynamic Multiple Sections State for Journal
  const [journalSections, setJournalSections] = useState<JournalSectionForm[]>([
    { heading: '', body: '', quote: '', image: '' },
  ]);

  // Upload & Status states
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setSession(session);
        fetchProjects();
        fetchJournalPosts();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProjects = async () => {
    let dbProjs: ProjectItem[] = [];
    if (isSupabaseConfigured()) {
      try {
        const { data: projectsData } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsData) {
          const { data: mediaData } = await supabase
            .from('project_media')
            .select('*')
            .order('sort_order', { ascending: true });

          dbProjs = (projectsData as ProjectItem[]).map((proj) => {
            const projMedia = mediaData
              ? mediaData.filter((m) => m.project_id === proj.id && m.file_type === 'image').map((m) => m.file_url)
              : [];
            return { ...proj, gallery_urls: projMedia };
          });
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err);
      }
    }

    // Map static projects
    const mappedStatic: ProjectItem[] = staticProjects.map((p) => ({
      id: p.slug,
      title: p.title,
      category: p.category,
      client: p.client,
      location: p.location,
      year: String(p.year),
      area: p.area,
      duration: p.duration,
      services: Array.isArray(p.services) ? p.services.join(' · ') : p.services,
      materials: Array.isArray(p.materials) ? p.materials.join(' · ') : p.materials,
      description: p.description,
      challenges: p.challenges,
      solution: p.solution,
      image_url: p.cover,
      video_url: p.video || null,
      gallery_urls: p.gallery || [],
      isStatic: true,
    }));

    // Filter out static ones that have been overridden in DB
    const dbSlugs = new Set(dbProjs.map((p) => p.id));
    const merged = [...dbProjs, ...mappedStatic.filter((p) => !dbSlugs.has(p.id))];

    setProjects(merged);
  };

  const fetchJournalPosts = async () => {
    let dbJournals: JournalItem[] = [];
    if (isSupabaseConfigured()) {
      try {
        const { data } = await supabase
          .from('journal_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (data) dbJournals = data as JournalItem[];
      } catch (err: any) {
        console.error('Error fetching journal posts:', err);
      }
    }

    // Map static journal posts
    const mappedStatic: JournalItem[] = staticJournalPosts.map((j) => ({
      id: j.slug,
      slug: j.slug,
      title: j.title,
      category: j.category,
      date: j.date,
      read_time: j.readTime,
      author_name: j.author.name,
      author_role: j.author.role,
      author_avatar: j.author.avatar,
      cover_image_url: j.coverImage,
      excerpt: j.excerpt,
      content: j.content,
      isStatic: true,
    }));

    // Filter out static ones overridden in DB
    const dbSlugs = new Set(dbJournals.map((j) => j.slug));
    const merged = [...dbJournals, ...mappedStatic.filter((j) => !dbSlugs.has(j.slug))];

    setJournalPosts(merged);
  };

  const handleLocalFileUpload = async (file: File, folder: string): Promise<string | null> => {
    if (!isSupabaseConfigured()) {
      setStatusMessage({ type: 'error', text: 'Supabase credentials are not configured.' });
      return null;
    }

    setUploading(true);
    setStatusMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `uploads/${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        if (uploadError.message.includes('bucket not found') || uploadError.message.includes('Failed to fetch')) {
          throw new Error('Supabase Storage bucket "project-media" does not exist yet. Please run the SQL Storage setup script in your Supabase SQL Editor once.');
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('project-media')
        .getPublicUrl(filePath);

      setStatusMessage({ type: 'success', text: 'File uploaded successfully!' });
      return publicUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatusMessage({ type: 'error', text: err.message || 'File upload failed.' });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleGalleryUpload = async (files: FileList) => {
    setUploading(true);
    setStatusMessage(null);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const url = await handleLocalFileUpload(files[i], 'gallery');
      if (url) newUrls.push(url);
    }

    if (newUrls.length > 0) {
      setGalleryUrls((prev) => [...prev, ...newUrls]);
      setStatusMessage({ type: 'success', text: `${newUrls.length} gallery image(s) uploaded successfully!` });
    }
    setUploading(false);
  };

  const addCustomGalleryUrl = () => {
    if (!customGalleryInput.trim()) return;
    setGalleryUrls((prev) => [...prev, customGalleryInput.trim()]);
    setCustomGalleryInput('');
  };

  const removeGalleryUrl = (index: number) => {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Dynamic Journal Sections Helpers ---
  const addJournalSection = () => {
    setJournalSections((prev) => [...prev, { heading: '', body: '', quote: '', image: '' }]);
  };

  const removeJournalSection = (index: number) => {
    if (journalSections.length <= 1) return;
    setJournalSections((prev) => prev.filter((_, i) => i !== index));
  };

  const updateJournalSection = (index: number, field: keyof JournalSectionForm, value: string) => {
    setJournalSections((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // --- Project Modal Functions ---
  const openProjectModal = (project?: ProjectItem) => {
    setStatusMessage(null);
    if (project) {
      setEditingProjectId(project.isStatic ? null : project.id);
      setTitle(project.title);
      setCategory(project.category);
      setClient(project.client || '');
      setLocation(project.location);
      setYear(project.year);
      setArea(project.area || '');
      setDuration(project.duration || '');
      setServices(project.services || '');
      setMaterials(project.materials || '');
      setDescription(project.description || '');
      setChallenges(project.challenges || '');
      setSolution(project.solution || '');
      setImageUrl(project.image_url);
      setVideoUrl(project.video_url || '');
      setGalleryUrls(project.gallery_urls || []);
    } else {
      setEditingProjectId(null);
      setTitle('');
      setCategory('Residential');
      setClient('');
      setLocation('');
      setYear(new Date().getFullYear().toString());
      setArea('');
      setDuration('');
      setServices('');
      setMaterials('');
      setDescription('');
      setChallenges('');
      setSolution('');
      setImageUrl('');
      setVideoUrl('');
      setGalleryUrls([]);
    }
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      setStatusMessage({ type: 'error', text: 'Project title and cover photo are required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const payload = {
      title,
      category,
      client: client || null,
      location,
      year,
      area: area || null,
      duration: duration || null,
      services: services || null,
      materials: materials || null,
      description: description || null,
      challenges: challenges || null,
      solution: solution || null,
      image_url: imageUrl,
      video_url: videoUrl || null,
    };

    try {
      let projectId = editingProjectId;

      if (editingProjectId) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProjectId);
        if (error) throw error;
      } else {
        const { data: newProj, error } = await supabase
          .from('projects')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        projectId = newProj.id;
      }

      if (projectId) {
        await supabase.from('project_media').delete().eq('project_id', projectId);
        if (galleryUrls.length > 0) {
          const mediaPayload = galleryUrls.map((url, idx) => ({
            project_id: projectId!,
            file_url: url,
            file_type: 'image' as const,
            sort_order: idx,
          }));
          await supabase.from('project_media').insert(mediaPayload);
        }
      }

      setIsProjectModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error('Error saving project:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save project.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, isStatic?: boolean) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    if (isStatic) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (err: any) {
      alert('Failed to delete project: ' + err.message);
    }
  };

  // --- Journal Modal Functions ---
  const openJournalModal = (post?: JournalItem) => {
    setStatusMessage(null);
    if (post) {
      setEditingJournalId(post.isStatic ? null : post.id);
      setJournalTitle(post.title);
      setJournalCategory(post.category);
      setJournalDate(post.date);
      setJournalReadTime(post.read_time);
      setJournalAuthorName(post.author_name);
      setJournalAuthorRole(post.author_role);
      setJournalCoverImage(post.cover_image_url);
      setJournalExcerpt(post.excerpt);
      
      const contentObj = typeof post.content === 'object' ? post.content : {};
      setJournalIntro(contentObj?.intro || '');
      setJournalConclusion(contentObj?.conclusion || '');

      const parsedSections: JournalSectionForm[] = contentObj?.sections?.map((sec: any) => ({
        heading: sec.heading || '',
        body: Array.isArray(sec.paragraphs) ? sec.paragraphs.join('\n\n') : (sec.body || ''),
        quote: sec.quote || '',
        image: sec.image || '',
      })) || [];

      setJournalSections(parsedSections.length > 0 ? parsedSections : [{ heading: '', body: '', quote: '', image: '' }]);
    } else {
      setEditingJournalId(null);
      setJournalTitle('');
      setJournalCategory('Essay');
      setJournalDate('Jun 2026');
      setJournalReadTime('6 min read');
      setJournalAuthorName('Aditya & Norah Sen');
      setJournalAuthorRole('Principal Architects');
      setJournalCoverImage('');
      setJournalExcerpt('');
      setJournalIntro('');
      setJournalConclusion('');
      setJournalSections([{ heading: '', body: '', quote: '', image: '' }]);
    }
    setIsJournalModalOpen(true);
  };

  const handleSaveJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle || !journalCoverImage) {
      setStatusMessage({ type: 'error', text: 'Article title and cover image are required.' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const slug = journalTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const contentStructure = {
      intro: journalIntro || journalExcerpt,
      sections: journalSections.map((sec) => ({
        heading: sec.heading || undefined,
        paragraphs: sec.body ? sec.body.split('\n\n').filter(Boolean) : [],
        quote: sec.quote || undefined,
        image: sec.image || undefined,
      })),
      conclusion: journalConclusion || undefined,
    };

    const payload = {
      slug,
      title: journalTitle,
      category: journalCategory,
      date: journalDate,
      read_time: journalReadTime,
      author_name: journalAuthorName,
      author_role: journalAuthorRole,
      author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      cover_image_url: journalCoverImage,
      excerpt: journalExcerpt || journalTitle,
      content: contentStructure,
    };

    try {
      if (editingJournalId) {
        const { error } = await supabase
          .from('journal_posts')
          .update(payload)
          .eq('id', editingJournalId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('journal_posts')
          .insert([payload]);
        if (error) throw error;
      }

      setIsJournalModalOpen(false);
      fetchJournalPosts();
    } catch (err: any) {
      console.error('Error saving journal article:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to save journal article.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJournal = async (id: string, isStatic?: boolean) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;
    if (isStatic) {
      setJournalPosts((prev) => prev.filter((j) => j.id !== id));
      return;
    }
    try {
      const { error } = await supabase.from('journal_posts').delete().eq('id', id);
      if (error) throw error;
      fetchJournalPosts();
    } catch (err: any) {
      alert('Failed to delete journal entry: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        Loading Admin Dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card px-8 py-5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-accent">Admin Portal</span>
            <span className="text-border">|</span>
            <h1 className="font-display text-xl">Atelier Norr CMS</h1>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 bg-background border border-border p-1 rounded-md">
            <button
              onClick={() => setActiveTab('projects')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'projects' ? 'bg-foreground text-background font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Layers size={14} /> Projects ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded text-xs uppercase tracking-wider transition-colors ${
                activeTab === 'journal' ? 'bg-foreground text-background font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen size={14} /> Journal Essays ({journalPosts.length})
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">{session?.user?.email}</span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 border border-border hover:border-destructive hover:text-destructive px-4 py-2 rounded transition-colors text-xs uppercase tracking-wider"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-luxe py-12 space-y-8">
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <h2 className="font-display text-3xl">Projects Directory</h2>
                <p className="text-sm text-muted-foreground mt-1">Manage project portfolios, specifications, gallery photos, and video media.</p>
              </div>
              <button
                onClick={() => openProjectModal()}
                className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-accent hover:text-white px-6 py-3 rounded transition-colors text-xs uppercase tracking-[0.15em] font-medium"
              >
                <Plus size={16} /> Add New Project
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group">
                  <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {proj.isStatic && (
                        <span className="bg-accent/80 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                          Pre-existing
                        </span>
                      )}
                      {proj.gallery_urls && proj.gallery_urls.length > 0 && (
                        <span className="bg-black/70 backdrop-blur text-white px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1">
                          <Images size={12} /> {proj.gallery_urls.length} Photos
                        </span>
                      )}
                      {proj.video_url && (
                        <span className="bg-black/70 backdrop-blur text-accent px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1">
                          <Film size={12} /> Video
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-accent uppercase tracking-widest">
                        <span>{proj.category}</span>
                        <span>{proj.year}</span>
                      </div>
                      <h3 className="font-display text-xl">{proj.title}</h3>
                      <p className="text-xs text-muted-foreground">{proj.location} {proj.area ? `• ${proj.area}` : ''}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => openProjectModal(proj)}
                        className="p-2 text-muted-foreground hover:text-foreground border border-border hover:border-foreground rounded transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.isStatic)}
                        className="p-2 text-muted-foreground hover:text-destructive border border-border hover:border-destructive rounded transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* JOURNAL ESSAYS TAB */}
        {activeTab === 'journal' && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <h2 className="font-display text-3xl">Journal Essays CMS</h2>
                <p className="text-sm text-muted-foreground mt-1">Publish architectural essays, material field notes, and studio reflections.</p>
              </div>
              <button
                onClick={() => openJournalModal()}
                className="inline-flex items-center gap-2 bg-foreground text-background hover:bg-accent hover:text-white px-6 py-3 rounded transition-colors text-xs uppercase tracking-[0.15em] font-medium"
              >
                <Plus size={16} /> Write New Essay
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {journalPosts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-lg overflow-hidden flex flex-col group">
                  <div className="aspect-[16/10] relative bg-muted overflow-hidden">
                    <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      {post.isStatic && (
                        <span className="bg-accent/80 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                          Pre-existing
                        </span>
                      )}
                      <span className="bg-black/70 backdrop-blur text-accent px-2.5 py-1 rounded text-xs font-mono">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-widest">
                        <span>{post.date}</span>
                        <span>{post.read_time}</span>
                      </div>
                      <h3 className="font-display text-xl">{post.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => openJournalModal(post)}
                        className="p-2 text-muted-foreground hover:text-foreground border border-border hover:border-foreground rounded transition-colors"
                        title="Edit Essay"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteJournal(post.id, post.isStatic)}
                        className="p-2 text-muted-foreground hover:text-destructive border border-border hover:border-destructive rounded transition-colors"
                        title="Delete Essay"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* PROJECT CREATION & EDITING MODAL */}
      <AnimatePresence>
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-border w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden my-8">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-xl">{editingProjectId ? 'Edit Project' : 'Add New Project'}</h3>
                <button onClick={() => setIsProjectModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              {statusMessage && (
                <div className={`p-4 mx-6 mt-6 rounded flex items-center gap-3 text-sm ${statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                  {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProject} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Project Title *</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Pollachi Sacred Sanctuary" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Category *</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded">
                      {categoryOptions.map((catOption) => (
                        <option key={catOption} value={catOption}>{catOption}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Location *</label>
                    <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Pollachi, Tamil Nadu" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Year *</label>
                    <input type="text" required value={year} onChange={(e) => setYear(e.target.value)} placeholder="2026" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Client Name</label>
                    <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Private Family Office" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Area (e.g. 8,800 sq.ft)</label>
                    <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="8,800 sq.ft" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Duration (e.g. 18 months)</label>
                    <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="18 months" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Services</label>
                    <input type="text" value={services} onChange={(e) => setServices(e.target.value)} placeholder="Architecture · Interior Design" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Materials</label>
                    <input type="text" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="Terracotta Brick · Kota Stone" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Main Description</label>
                    <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-background border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Challenge</label>
                    <textarea rows={2} value={challenges} onChange={(e) => setChallenges(e.target.value)} className="w-full bg-background border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Approach / Solution</label>
                    <textarea rows={2} value={solution} onChange={(e) => setSolution(e.target.value)} className="w-full bg-background border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none" />
                  </div>
                </div>

                {/* Media Assets (Cover & Video) */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <h4 className="font-display text-sm uppercase tracking-wider text-accent">Media Assets</h4>

                  {/* Cover Photo */}
                  <div className="space-y-2">
                    <label className="eyebrow text-muted-foreground block">Cover Photo URL / Upload *</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        required
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or click Browse"
                        className="flex-1 bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded"
                      />
                      <label className="inline-flex items-center gap-2 border border-border hover:border-accent px-4 py-2.5 rounded cursor-pointer text-xs uppercase tracking-wider transition-colors shrink-0">
                        <ImageIcon size={14} /> Browse Cover
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleLocalFileUpload(e.target.files[0], 'covers');
                              if (url) setImageUrl(url);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Video Upload */}
                  <div className="space-y-2">
                    <label className="eyebrow text-muted-foreground block">Project Video URL / Upload (Handbrake compressed MP4)</label>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://your-video-url.mp4 or click Browse MP4"
                        className="flex-1 bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded"
                      />
                      <label className="inline-flex items-center gap-2 border border-border hover:border-accent px-4 py-2.5 rounded cursor-pointer text-xs uppercase tracking-wider transition-colors shrink-0">
                        <Film size={14} /> Browse MP4
                        <input
                          type="file"
                          accept="video/mp4,video/webm"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              const url = await handleLocalFileUpload(e.target.files[0], 'videos');
                              if (url) setVideoUrl(url);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Multiple Gallery Images Upload */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-sm uppercase tracking-wider text-accent">Project Photo Gallery (Multiple Photos)</h4>
                    </div>
                    <label className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded cursor-pointer text-xs uppercase tracking-wider transition-colors">
                      <Images size={14} /> Upload Multiple Photos
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files && e.target.files.length > 0 && handleMultipleGalleryUpload(e.target.files)}
                      />
                    </label>
                  </div>

                  {/* URL Manual Add Input */}
                  <div className="flex gap-3">
                    <input
                      type="url"
                      value={customGalleryInput}
                      onChange={(e) => setCustomGalleryInput(e.target.value)}
                      placeholder="Add photo URL manually (e.g. https://...)"
                      className="flex-1 bg-background border border-input focus:border-accent outline-none px-4 py-2 text-sm rounded"
                    />
                    <button
                      type="button"
                      onClick={addCustomGalleryUrl}
                      className="px-4 py-2 border border-border hover:border-accent hover:text-accent text-xs uppercase tracking-wider rounded"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Gallery Thumbnails List */}
                  {galleryUrls.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                      {galleryUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded overflow-hidden border border-border group bg-muted">
                          <img src={url} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryUrl(idx)}
                            className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-90 group-hover:opacity-100 hover:scale-110 transition-all"
                          >
                            <X size={12} />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
                  <button type="button" onClick={() => setIsProjectModalOpen(false)} className="px-6 py-3 border border-border rounded text-xs uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={saving || uploading} className="px-8 py-3 bg-foreground text-background rounded text-xs uppercase tracking-widest font-medium disabled:opacity-50">
                    {saving ? 'Saving…' : editingProjectId ? 'Update Project' : 'Publish Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOURNAL CREATION & EDITING MODAL */}
      <AnimatePresence>
        {isJournalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card border border-border w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden my-8">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-xl">{editingJournalId ? 'Edit Journal Essay' : 'Write New Journal Essay'}</h3>
                <button onClick={() => setIsJournalModalOpen(false)} className="text-muted-foreground hover:text-foreground">✕</button>
              </div>

              {statusMessage && (
                <div className={`p-4 mx-6 mt-6 rounded flex items-center gap-3 text-sm ${statusMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                  {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveJournal} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Essay Title *</label>
                    <input type="text" required value={journalTitle} onChange={(e) => setJournalTitle(e.target.value)} placeholder="e.g. On the discipline of restraint" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Category *</label>
                    <select value={journalCategory} onChange={(e) => setJournalCategory(e.target.value)} className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded">
                      <option value="Essay">Essay</option>
                      <option value="Materials">Materials</option>
                      <option value="Field notes">Field notes</option>
                      <option value="Studio">Studio</option>
                      <option value="Lighting">Lighting</option>
                      <option value="Interviews">Interviews</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Publication Date</label>
                    <input type="text" value={journalDate} onChange={(e) => setJournalDate(e.target.value)} placeholder="Jun 2026" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Reading Time</label>
                    <input type="text" value={journalReadTime} onChange={(e) => setJournalReadTime(e.target.value)} placeholder="6 min read" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                  <div>
                    <label className="eyebrow text-muted-foreground block mb-2">Author Name</label>
                    <input type="text" value={journalAuthorName} onChange={(e) => setJournalAuthorName(e.target.value)} placeholder="Aditya & Norah Sen" className="w-full bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded" />
                  </div>
                </div>

                <div>
                  <label className="eyebrow text-muted-foreground block mb-2">Excerpt / Subtitle *</label>
                  <textarea rows={2} required value={journalExcerpt} onChange={(e) => setJournalExcerpt(e.target.value)} placeholder="True luxury in modern architecture lies not in addition, but in the radical subtraction..." className="w-full bg-background border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none" />
                </div>

                {/* Cover Image URL / Upload */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="eyebrow text-muted-foreground block">Article Cover Image URL / Upload *</label>
                  <div className="flex gap-3">
                    <input
                      type="url"
                      required
                      value={journalCoverImage}
                      onChange={(e) => setJournalCoverImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or click Browse"
                      className="flex-1 bg-background border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded"
                    />
                    <label className="inline-flex items-center gap-2 border border-border hover:border-accent px-4 py-2.5 rounded cursor-pointer text-xs uppercase tracking-wider transition-colors shrink-0">
                      <ImageIcon size={14} /> Browse Cover
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await handleLocalFileUpload(e.target.files[0], 'journal-covers');
                            if (url) setJournalCoverImage(url);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Introductory Lead Paragraph */}
                <div className="pt-4 border-t border-border">
                  <label className="eyebrow text-muted-foreground block mb-2">Introductory Lead Paragraph</label>
                  <textarea rows={3} value={journalIntro} onChange={(e) => setJournalIntro(e.target.value)} placeholder="Opening lead paragraph set in large italic serif font..." className="w-full bg-background border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none" />
                </div>

                {/* DYNAMIC MULTIPLE ESSAY SECTIONS */}
                <div className="space-y-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-sm uppercase tracking-wider text-accent">Article Content Sections</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">Add multiple sections with headings, paragraphs, pull-quotes, and inline photos.</p>
                    </div>
                    <button
                      type="button"
                      onClick={addJournalSection}
                      className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent hover:bg-accent hover:text-white px-4 py-2 rounded text-xs uppercase tracking-wider transition-colors font-medium"
                    >
                      <Plus size={14} /> Add Another Section
                    </button>
                  </div>

                  {journalSections.map((sec, secIdx) => (
                    <div key={secIdx} className="bg-background/60 border border-border p-6 rounded-lg space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <span className="eyebrow text-accent">Section #{secIdx + 1}</span>
                        {journalSections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeJournalSection(secIdx)}
                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                          >
                            <X size={14} /> Remove Section
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="eyebrow text-muted-foreground block mb-1.5">Section Heading</label>
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => updateJournalSection(secIdx, 'heading', e.target.value)}
                          placeholder="e.g. The Geometry of Silence"
                          className="w-full bg-card border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded"
                        />
                      </div>

                      <div>
                        <label className="eyebrow text-muted-foreground block mb-1.5">Section Body Paragraphs (separate paragraphs with blank line)</label>
                        <textarea
                          rows={4}
                          value={sec.body}
                          onChange={(e) => updateJournalSection(secIdx, 'body', e.target.value)}
                          placeholder="Restraint is not minimalism. Minimalism, as it is often popularized today..."
                          className="w-full bg-card border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none"
                        />
                      </div>

                      <div>
                        <label className="eyebrow text-muted-foreground block mb-1.5">Pull-Quote (Featured Statement Box)</label>
                        <input
                          type="text"
                          value={sec.quote}
                          onChange={(e) => updateJournalSection(secIdx, 'quote', e.target.value)}
                          placeholder="Architecture is the learned game, correct and magnificent..."
                          className="w-full bg-card border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded"
                        />
                      </div>

                      {/* Inline Section Image */}
                      <div className="space-y-2">
                        <label className="eyebrow text-muted-foreground block mb-1.5">Inline Section Image URL / Upload</label>
                        <div className="flex gap-3">
                          <input
                            type="url"
                            value={sec.image}
                            onChange={(e) => updateJournalSection(secIdx, 'image', e.target.value)}
                            placeholder="https://images.unsplash.com/... or click Browse"
                            className="flex-1 bg-card border border-input focus:border-accent outline-none px-4 py-2.5 text-sm rounded"
                          />
                          <label className="inline-flex items-center gap-2 border border-border hover:border-accent px-4 py-2.5 rounded cursor-pointer text-xs uppercase tracking-wider transition-colors shrink-0">
                            <ImageIcon size={14} /> Browse Image
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                if (e.target.files?.[0]) {
                                  const url = await handleLocalFileUpload(e.target.files[0], 'journal-inline');
                                  if (url) updateJournalSection(secIdx, 'image', url);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addJournalSection}
                    className="w-full py-3 border border-dashed border-border hover:border-accent hover:text-accent rounded text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add Another Section (Section #{journalSections.length + 1})
                  </button>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="eyebrow text-muted-foreground block mb-2">Concluding Reflection</label>
                  <textarea rows={3} value={journalConclusion} onChange={(e) => setJournalConclusion(e.target.value)} placeholder="Restraint is a discipline that requires patience and confidence..." className="w-full bg-background border border-input focus:border-accent outline-none p-4 text-sm rounded resize-none" />
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border">
                  <button type="button" onClick={() => setIsJournalModalOpen(false)} className="px-6 py-3 border border-border rounded text-xs uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={saving || uploading} className="px-8 py-3 bg-foreground text-background rounded text-xs uppercase tracking-widest font-medium disabled:opacity-50">
                    {saving ? 'Saving…' : editingJournalId ? 'Update Essay' : 'Publish Essay'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
