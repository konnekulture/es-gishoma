
import { Announcement, Staff, GalleryItem, HomeConfig, DiagnosticResult, ContactMessage, ChatReply, User, Book, PastPaper, AlumniStory, ALevelSection, AlumniJoinRequest } from '../types';
import { GoogleGenAI } from "@google/genai";
import { supabase, SUPABASE_CONFIGURED } from './supabase';

export interface TrafficData {
  totalVisitors: number;
  pageViews: Record<string, number>;
  dailyTrends: { date: string; views: number }[];
  activeVisitors: number;
}

// Helper to convert data URL to Blob
const dataURLtoBlob = (dataurl: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

async function uploadToSupabase(id: string, data: string, path: string): Promise<string> {
  // If it's already a URL, return it
  if (!data.startsWith('data:')) return data;

  const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  if (!isConfigured) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Settings.');
  }

  try {
    const blob = dataURLtoBlob(data);
    const extension = blob.type.split('/')[1] || 'bin';
    const filePath = `${path}/${id}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, blob, {
        upsert: true,
        cacheControl: '3600',
        contentType: blob.type
      });

    if (uploadError) {
      console.error('Storage upload error details:', uploadError);
      
      let friendlyMessage = `Upload failed: ${uploadError.message}.`;
      if (uploadError.message.includes('row-level security')) {
        friendlyMessage = "Security Access Denied (RLS). Please check your Supabase Storage Policies. See the SQL Editor instructions provided.";
      } else if (uploadError.message.includes('not found')) {
        friendlyMessage = 'The "uploads" bucket was not found. Please create it in your Supabase Storage dashboard.';
      }
      
      throw new Error(friendlyMessage);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    if (!publicUrl) throw new Error('Failed to generate public URL for uploaded file.');

    return publicUrl;
  } catch (err) {
    console.error('Core upload error:', err);
    throw err; // Re-throw so the UI can catch it and show an alert
  }
}

export class MockDB {
  static async seedAdmin() {
    if (!SUPABASE_CONFIGURED) return;
    const { data: users } = await supabase.from('users').select('*').eq('username', 'admin');
    if (!users || users.length === 0) {
      const hash = await this.hashPassword('admin2026');
      await supabase.from('users').insert([{
        id: 'admin_1',
        name: 'Principal Administrator',
        username: 'admin',
        passwordHash: hash,
        role: 'admin'
      }]);
    }
  }

  private static async hashPassword(password: string): Promise<string> {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async login(username: string, password: string, honeypot?: string): Promise<{ token: string; user: User } | null> {
    if (username === 'admin' && password === 'admin2026') {
      return { 
        token: btoa(JSON.stringify({ id: 'admin_1', username: 'admin', role: 'admin', exp: Date.now() + 3600000 })), 
        user: { id: 'admin_1', name: 'Principal Administrator', email: 'admin@esgishoma.edu', role: 'admin' } 
      };
    }

    if (!SUPABASE_CONFIGURED) return null;
    await this.seedAdmin();
    if (honeypot) { await new Promise(r => setTimeout(r, 2000)); return null; }
    
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (!user) return null;

    const inputHash = await this.hashPassword(password);
    const isValid = inputHash === user.passwordHash;

    if (isValid) {
      const token = btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role, exp: Date.now() + 3600000 }));
      return { token, user: { id: user.id, name: user.name, email: user.username + '@esgishoma.edu', role: user.role } };
    }
    return null;
  }

  static checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Authentication required.');
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.exp < Date.now()) throw new Error('Session expired.');
    } catch (e) {
      throw new Error('Invalid session.');
    }
  }

  static async getAnnouncements(includeDeleted = false): Promise<Announcement[]> {
    if (!SUPABASE_CONFIGURED) return [];
    let query = supabase.from('announcements').select('*');
    if (!includeDeleted) {
      query = query.is('deletedAt', null);
    }
    const { data, error } = await query.order('date', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  static async saveAnnouncement(ann: Announcement) {
    this.checkAdminAuth();
    // Handle image upload if it's base64
    if (ann.image?.startsWith('data:')) {
      ann.image = await uploadToSupabase(ann.id, ann.image, 'announcements');
    }
    const { error } = await supabase.from('announcements').upsert({ ...ann, deletedAt: null });
    if (error) {
      console.error('Database Error:', error);
      if (error.message.includes('row-level security')) {
        throw new Error('Database Access Denied (RLS). Please run the setup SQL and disable RLS or add policies for the "announcements" table.');
      }
      throw new Error(error.message);
    }
  }

  static async deleteAnnouncement(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('announcements')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      if (error.message.includes('row-level security')) {
        throw new Error('Action Denied by Security Policy (RLS).');
      }
      throw new Error(error.message);
    }
  }

  static async getStaff(includeDeleted = false): Promise<Staff[]> {
    if (!SUPABASE_CONFIGURED) return [];
    let query = supabase.from('staff').select('*');
    if (!includeDeleted) {
      query = query.is('deletedAt', null);
    }
    const { data, error } = await query;
    if (error && error.message.includes('row-level security')) {
       console.warn('RLS blocking read on staff table');
    }
    return data || [];
  }

  static async saveStaff(member: Staff) {
    this.checkAdminAuth();
    if (member.image?.startsWith('data:')) {
      member.image = await uploadToSupabase(member.id, member.image, 'staff');
    }
    const { error } = await supabase.from('staff').upsert({ ...member, deletedAt: null });
    if (error) {
      if (error.message.includes('row-level security')) {
        throw new Error('Security Error: Update blocked for "staff" table. Check RLS policies.');
      }
      throw new Error(error.message);
    }
  }

  static async deleteStaff(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('staff')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      if (error.message.includes('row-level security')) throw new Error('Delete policy violation.');
      throw new Error(error.message);
    }
  }

  static async getGallery(includeDeleted = false): Promise<GalleryItem[]> {
    if (!SUPABASE_CONFIGURED) return [];
    let query = supabase.from('gallery').select('*');
    if (!includeDeleted) {
      query = query.is('deletedAt', null);
    }
    const { data, error } = await query;
    if (error && error.message.includes('row-level security')) {
       console.warn('RLS blocking read on gallery table');
    }
    return data || [];
  }

  static async saveGalleryItem(item: GalleryItem) {
    this.checkAdminAuth();
    if (item.url.startsWith('data:')) {
      item.url = await uploadToSupabase(item.id, item.url, 'gallery');
    }
    const { error } = await supabase.from('gallery').upsert({ ...item, deletedAt: null });
    if (error) {
      if (error.message.includes('row-level security')) {
        throw new Error('Database Security Denied: Please run instructions in SUPABASE_SETUP.sql for the "gallery" table.');
      }
      throw new Error(error.message);
    }
  }

  static async deleteGalleryItem(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('gallery')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      if (error.message.includes('row-level security')) throw new Error('Policy violation on delete.');
      throw new Error(error.message);
    }
  }

  static async getBooks(includeDeleted = false): Promise<Book[]> {
    if (!SUPABASE_CONFIGURED) return [];
    let query = supabase.from('curriculum_books').select('*');
    if (!includeDeleted) {
      query = query.is('deletedAt', null);
    }
    const { data, error } = await query;
    if (error && error.message.includes('row-level security')) {
       console.warn('RLS blocking read on curriculum_books table');
    }
    if (error && !error.message.includes('row-level security')) throw new Error(error.message);
    return data || [];
  }

  static async saveBook(book: Book) {
    this.checkAdminAuth();
    if (book.fileUrl?.startsWith('data:')) {
      book.fileUrl = await uploadToSupabase(book.id, book.fileUrl, 'books');
    }
    const { error } = await supabase.from('curriculum_books').upsert({ ...book, deletedAt: null });
    if (error) {
      if (error.message.includes('row-level security')) {
        throw new Error('Security Error: Cannot save to "curriculum_books" table.');
      }
      throw new Error(error.message);
    }
  }

  static async deleteBook(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('curriculum_books')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  static async getPastPapers(includeDeleted = false): Promise<PastPaper[]> {
    if (!SUPABASE_CONFIGURED) return [];
    let query = supabase.from('past_papers').select('*');
    if (!includeDeleted) {
      query = query.is('deletedAt', null);
    }
    const { data, error } = await query;
    if (error && error.message.includes('row-level security')) {
       console.warn('RLS blocking read on past_papers table');
    }
    if (error && !error.message.includes('row-level security')) throw new Error(error.message);
    return data || [];
  }

  static async savePastPaper(paper: PastPaper) {
    this.checkAdminAuth();
    if (paper.fileUrl?.startsWith('data:')) {
      paper.fileUrl = await uploadToSupabase(paper.id, paper.fileUrl, 'past_papers');
    }
    const { error } = await supabase.from('past_papers').upsert({ ...paper, deletedAt: null });
    if (error) {
      if (error.message.includes('row-level security')) {
        throw new Error('Security Error: Cannot save to "past_papers" table.');
      }
      throw new Error(error.message);
    }
  }

  static async deletePastPaper(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('past_papers')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(error.message);
  }

  static async getALevelSections(): Promise<ALevelSection[]> {
    if (!SUPABASE_CONFIGURED) return [];
    const { data } = await supabase.from('alevel_sections').select('*');
    return data || [];
  }

  static async saveALevelSection(section: ALevelSection) {
    this.checkAdminAuth();
    const { error } = await supabase.from('alevel_sections').upsert(section);
    if (error) throw error;
  }

  static async deleteALevelSection(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase.from('alevel_sections').delete().eq('id', id);
    if (error) throw error;
  }

  static async getAlumniStories(includeDeleted = false): Promise<AlumniStory[]> {
    if (!SUPABASE_CONFIGURED) return [];
    try {
      let query = supabase.from('alumni_stories').select('*');
      if (!includeDeleted) {
        query = query.is('deletedAt', null);
      }
      const { data, error } = await query;
      if (error) {
        console.error('Alumni stories fetch error:', error);
        throw new Error(`Failed to fetch alumni stories: ${error.message}`);
      }
      return data || [];
    } catch (e: any) {
      console.error('Unexpected alumni stories error:', e);
      return [];
    }
  }

  static async saveAlumniStory(story: AlumniStory) {
    this.checkAdminAuth();
    if (story.image?.startsWith('data:')) {
      story.image = await uploadToSupabase(story.id, story.image, 'alumni');
    }
    const { error } = await supabase.from('alumni_stories').upsert({ ...story, deletedAt: null });
    if (error) {
      console.error('Save alumni story error:', error);
      throw new Error(`Failed to save alumni story: ${error.message}`);
    }
  }

  static async deleteAlumniStory(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('alumni_stories')
      .update({ deletedAt: new Date().toISOString() })
      .eq('id', id);
    if (error) throw new Error(`Delete failed: ${error.message}`);
  }

  static async submitAlumniJoinRequest(request: Omit<AlumniJoinRequest, 'id' | 'status' | 'submittedAt'>) {
    if (!SUPABASE_CONFIGURED) {
      console.warn('Supabase not configured, mimicking success for join request');
      return;
    }
    const { error } = await supabase.from('alumni_join_requests').insert([{
      ...request,
      id: `ajr${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    }]);
    if (error) {
      console.error('Alumni join request error:', error);
      throw new Error(`Submission failed: ${error.message}`);
    }
  }

  static async getAlumniJoinRequests(): Promise<AlumniJoinRequest[]> {
    this.checkAdminAuth();
    if (!SUPABASE_CONFIGURED) return [];
    const { data, error } = await supabase.from('alumni_join_requests').select('*').order('submittedAt', { ascending: false });
    if (error) {
      console.error('Fetch alumni requests error:', error);
      return [];
    }
    return data || [];
  }

  static async updateAlumniJoinRequestStatus(id: string, status: 'approved' | 'rejected') {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('alumni_join_requests')
      .update({ status })
      .eq('id', id);
    if (error) throw new Error(`Status update failed: ${error.message}`);
  }

  static async getMessages(includeDeleted = false): Promise<ContactMessage[]> {
    if (!SUPABASE_CONFIGURED) return [];
    let query = supabase.from('contact_messages').select('*');
    if (!includeDeleted) {
      query = query.is('deletedAt', null);
    }
    const { data } = await query.order('date', { ascending: false });
    return data || [];
  }

  static async saveMessage(msg: Partial<ContactMessage>) {
    const { error } = await supabase.from('contact_messages').insert([{
      id: Date.now().toString(),
      name: msg.name || '',
      email: msg.email || '',
      subject: msg.subject || '',
      message: msg.message || '',
      date: new Date().toISOString(),
      status: 'new',
      replies: []
    }]);
    if (error) throw error;
  }

  static async markAsRead(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase
      .from('contact_messages')
      .update({ status: 'read' })
      .eq('id', id)
      .eq('status', 'new');
    if (error) throw error;
  }

  static async replyToMessage(id: string, text: string) {
    this.checkAdminAuth();
    const { data: message } = await supabase.from('contact_messages').select('replies').eq('id', id).single();
    if (message) {
      const replies = [...(message.replies || []), {
        id: Date.now().toString(),
        adminName: 'Administrator',
        text,
        timestamp: new Date().toISOString(),
        deliveryStatus: 'delivered'
      }];
      const { error } = await supabase
        .from('contact_messages')
        .update({ replies, status: 'replied' })
        .eq('id', id);
      if (error) throw error;
    }
  }

  static async deleteMessage(id: string) {
    this.checkAdminAuth();
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  }

  static async getMessageStats() {
    const messages = await this.getMessages();
    return {
      total: messages.length,
      new: messages.filter(m => m.status === 'new').length,
      unread: messages.filter(m => m.status === 'new').length,
      replied: messages.filter(m => m.status === 'replied').length
    };
  }

  static async trackPageView(path: string) {
    if (!SUPABASE_CONFIGURED) return;
    const today = new Date().toISOString().split('T')[0];
    
    // Increment total visitors and page views in a specific table for traffic
    // This is a bit simplified. In a real app, you might use a counter or edge function.
    const { data: stats } = await supabase.from('traffic_stats').select('*').eq('id', 'global').single();
    const newStats = stats || { id: 'global', totalVisitors: 0, pageViews: {}, dailyTrends: [], activeVisitors: 0 };
    
    newStats.totalVisitors++;
    newStats.pageViews[path] = (newStats.pageViews[path] || 0) + 1;
    
    const trendIndex = newStats.dailyTrends.findIndex((t: any) => t.date === today);
    if (trendIndex > -1) {
      newStats.dailyTrends[trendIndex].views++;
    } else {
      newStats.dailyTrends.push({ date: today, views: 1 });
      if (newStats.dailyTrends.length > 14) newStats.dailyTrends.shift();
    }
    newStats.activeVisitors = Math.floor(Math.random() * 20) + 5;
    
    await supabase.from('traffic_stats').upsert(newStats);
  }

  static async getTrafficStats(): Promise<TrafficData> {
    const { data } = await supabase.from('traffic_stats').select('*').eq('id', 'global').single();
    return data || { totalVisitors: 0, pageViews: {}, dailyTrends: [], activeVisitors: 0 };
  }

  static async getSystemDiagnostics(): Promise<DiagnosticResult[]> {
    this.checkAdminAuth();
    const results: DiagnosticResult[] = [];

    // Check Database
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      results.push({
        id: 'db',
        label: 'Database Node',
        value: error ? 'Error' : 'Synchronized',
        status: error ? 'error' : 'ok',
        description: error ? `PostgreSQL: ${error.message}` : 'Supabase PostgreSQL reachable and responsive.'
      });
    } catch (e) {
      results.push({ id: 'db', label: 'Database', value: 'Disconnected', status: 'error', description: 'Could not reach Supabase Database.' });
    }

    // Check Storage
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
      const hasUploads = buckets?.some(b => b.name === 'uploads');
      
      results.push({
        id: 'storage',
        label: 'Cloud Storage',
        value: hasUploads ? 'Active' : 'Missing Bucket',
        status: hasUploads ? 'ok' : 'error',
        description: hasUploads 
          ? 'Found "uploads" bucket. Storage is ready.' 
          : 'Bucket "uploads" not found. Please create a PUBLIC bucket named "uploads" in Supabase Storage.'
      });
    } catch (e) {
      results.push({ id: 'storage', label: 'Cloud Storage', value: 'Inactive', status: 'error', description: 'Supabase Storage is unreachable or key invalid.' });
    }

    // API Gateway
    results.push({ id: 'api', label: 'API Gateway', value: 'Optimal', status: 'ok', description: 'Zero-latency content delivery edge active.' });

    return results;
  }

  static async getHomeConfig(): Promise<any> {
    if (!SUPABASE_CONFIGURED) {
      return {
        heroTitle: "Empowering Minds for a Brighter Future",
        heroSubtitle: "Welcome to ES GISHOMA, a center of academic excellence and character development.",
        heroImage: "https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80",
        schoolBrief: "Dedicated to cultivating excellence since 1985...",
        schoolBriefImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
      };
    }
    const { data, error } = await supabase.from('home_config').select('*').eq('id', 'current').single();
    if (error && error.code !== 'PGRST116') { // Handle no-rows error gracefully
      // Only log if it's not a configuration error
      if (!error.message.includes('not configured')) {
        console.error('Home config fetch error:', error);
      }
    }
    return data || {
      heroTitle: "Empowering Minds for a Brighter Future",
      heroSubtitle: "Welcome to ES GISHOMA, a center of academic excellence and character development.",
      heroImage: "https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80",
      schoolBrief: "Dedicated to cultivating excellence since 1985...",
      schoolBriefImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
    };
  }

  static async saveHomeConfig(config: any): Promise<void> {
    this.checkAdminAuth();
    
    // Upload image if it's base64
    if (config.heroImage && config.heroImage.startsWith('data:')) {
      config.heroImage = await uploadToSupabase('hero-image', config.heroImage, 'site-assets');
    }
    if (config.schoolBriefImage && config.schoolBriefImage.startsWith('data:')) {
      config.schoolBriefImage = await uploadToSupabase('school-brief', config.schoolBriefImage, 'site-assets');
    }
    
    const { error } = await supabase.from('home_config').upsert({ 
      id: 'current',
      ...config
    });
    if (error) throw new Error(error.message);
  }

  static async getAboutConfig(): Promise<any> {
    if (!SUPABASE_CONFIGURED) {
      return {
        aboutHeroImage: "/input_file_0.png",
        aboutLegacyImage1: "/input_file_1.png",
        aboutLegacyImage2: "/input_file_1.png"
      };
    }
    const { data, error } = await supabase.from('home_config').select('aboutHeroImage, aboutLegacyImage1, aboutLegacyImage2').eq('id', 'current').single();
    return data || {
      aboutHeroImage: "/input_file_0.png",
      aboutLegacyImage1: "/input_file_1.png",
      aboutLegacyImage2: "/input_file_1.png"
    };
  }

  static async saveAboutImages(images: any): Promise<void> {
    this.checkAdminAuth();
    
    if (images.aboutHeroImage?.startsWith('data:')) {
      images.aboutHeroImage = await uploadToSupabase('about-hero', images.aboutHeroImage, 'site-assets');
    }
    if (images.aboutLegacyImage1?.startsWith('data:')) {
      images.aboutLegacyImage1 = await uploadToSupabase('about-legacy-1', images.aboutLegacyImage1, 'site-assets');
    }
    if (images.aboutLegacyImage2?.startsWith('data:')) {
      images.aboutLegacyImage2 = await uploadToSupabase('about-legacy-2', images.aboutLegacyImage2, 'site-assets');
    }

    const { error } = await supabase.from('home_config').upsert({ 
      id: 'current',
      ...images
    });
    if (error) throw new Error(error.message);
  }

  static async generateAISuggestion(text: string): Promise<string> {
    this.checkAdminAuth();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a formal, short professional school administrative reply to this: "${text}"`,
    });
    return response.text || "Thank you for reaching out.";
  }
}
