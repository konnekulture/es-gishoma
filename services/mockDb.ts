
import { Announcement, Staff, GalleryItem, HomeConfig, DiagnosticResult, ContactMessage, ChatReply, User } from '../types';
import { GoogleGenAI } from "@google/genai";

export interface TrafficData {
  totalVisitors: number;
  pageViews: Record<string, number>;
  dailyTrends: { date: string; views: number }[];
  activeVisitors: number;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [];
const INITIAL_STAFF: Staff[] = [];
const INITIAL_GALLERY: GalleryItem[] = [];
const INITIAL_MESSAGES: ContactMessage[] = [];

// Seeded Admin Credentials
// Username: "admin"
// Password: "school2026"
const SEEDED_ADMIN_HASH = '3391783f984a926f437c95e63d3f9b2f2c84293f77344933a39281a17951558c';
const SEEDED_ADMIN = {
  id: 'admin_1',
  name: 'Principal Administrator',
  username: 'admin',
  passwordHash: SEEDED_ADMIN_HASH,
  role: 'admin' as const
};

export class MockDB {
  private static getStore(key: string, initial: any) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return initial;
      const parsed = JSON.parse(data);
      return parsed || initial;
    } catch (e) {
      console.error(`Store corruption detected for key: ${key}. Resetting.`);
      return initial;
    }
  }

  static setStore(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to write to storage: ${key}`, e);
    }
  }

  private static async hashPassword(password: string): Promise<string> {
    try {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      console.warn("Crypto API unavailable, falling back to basic hash.");
      let hash = 0;
      for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return 'm-' + hash.toString(16);
    }
  }

  static async seedAdmin() {
    const users = this.getStore('users', []);
    const adminIndex = users.findIndex((u: any) => String(u.username) === 'admin');
    if (adminIndex > -1) {
      users[adminIndex] = { ...users[adminIndex], ...SEEDED_ADMIN };
    } else {
      users.push(SEEDED_ADMIN);
    }
    this.setStore('users', users);
  }

  static async login(username: string, password: string): Promise<{ token: string; user: User } | null> {
    await this.seedAdmin();
    const attempts = parseInt(sessionStorage.getItem('login_attempts') || '0');
    if (attempts >= 10) { 
      throw new Error("Security lockout: Too many failed attempts. Please restart your browser.");
    }
    const users = this.getStore('users', []);
    const user = users.find((u: any) => String(u.username) === String(username));
    if (!user) {
      sessionStorage.setItem('login_attempts', (attempts + 1).toString());
      return null;
    }
    const inputHash = await this.hashPassword(password);
    if (inputHash === user.passwordHash || (username === 'admin' && password === 'school2026')) {
      sessionStorage.removeItem('login_attempts');
      const token = btoa(JSON.stringify({ 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        exp: Date.now() + 3600000,
        iat: Date.now()
      }));
      return {
        token,
        user: { id: user.id, name: user.name, email: user.username + '@esgishoma.edu', role: user.role }
      };
    }
    sessionStorage.setItem('login_attempts', (attempts + 1).toString());
    return null;
  }

  static checkAdminAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Unauthorized: Authentication session missing.');
    try {
      const decoded = JSON.parse(atob(token));
      if (decoded.role !== 'admin' || decoded.exp < Date.now()) {
        throw new Error('Unauthorized: Admin session expired.');
      }
    } catch (e) {
      throw new Error('Unauthorized: Invalid security context.');
    }
  }

  private static softDelete(key: string, id: string) {
    this.checkAdminAuth();
    const items = this.getStore(key, []);
    const index = items.findIndex((i: any) => String(i.id) === String(id));
    if (index !== -1) {
      items[index].deletedAt = new Date().toISOString();
      this.setStore(key, items);
    }
  }

  private static restore(key: string, id: string) {
    this.checkAdminAuth();
    const items = this.getStore(key, []);
    const index = items.findIndex((i: any) => String(i.id) === String(id));
    if (index !== -1) {
      items[index].deletedAt = null;
      this.setStore(key, items);
    }
  }

  private static permanentDelete(key: string, id: string) {
    this.checkAdminAuth();
    const items = this.getStore(key, []);
    const filtered = items.filter((i: any) => String(i.id).trim() !== String(id).trim());
    this.setStore(key, filtered);
  }

  // --- Announcements ---
  static getAnnouncements(includeDeleted = false): Announcement[] {
    const items = this.getStore('announcements', INITIAL_ANNOUNCEMENTS);
    return includeDeleted ? items : items.filter((a: Announcement) => !a.deletedAt);
  }

  static async saveAnnouncement(ann: Announcement) {
    this.checkAdminAuth();
    const anns = this.getAnnouncements(true);
    const index = anns.findIndex(a => String(a.id) === String(ann.id));
    if (index > -1) anns[index] = { ...ann, deletedAt: null };
    else anns.push(ann);
    this.setStore('announcements', anns);
  }

  static async deleteAnnouncement(id: string) {
    this.softDelete('announcements', id);
  }

  static async restoreAnnouncement(id: string) {
    this.restore('announcements', id);
  }

  static async permanentDeleteAnnouncement(id: string) {
    this.permanentDelete('announcements', id);
  }

  // --- Staff ---
  static getStaff(includeDeleted = false): Staff[] {
    const items = this.getStore('staff', INITIAL_STAFF);
    return includeDeleted ? items : items.filter((s: Staff) => !s.deletedAt);
  }

  static async saveStaff(member: Staff) {
    this.checkAdminAuth();
    const staff = this.getStaff(true);
    const index = staff.findIndex(s => String(s.id) === String(member.id));
    if (index > -1) staff[index] = { ...member, deletedAt: null };
    else staff.push(member);
    this.setStore('staff', staff);
  }

  static async deleteStaff(id: string) {
    this.softDelete('staff', id);
  }

  static async restoreStaff(id: string) {
    this.restore('staff', id);
  }

  static async permanentDeleteStaff(id: string) {
    this.permanentDelete('staff', id);
  }

  // --- Gallery ---
  static getGallery(includeDeleted = false): GalleryItem[] {
    const items = this.getStore('gallery', INITIAL_GALLERY);
    return includeDeleted ? items : items.filter((g: GalleryItem) => !g.deletedAt);
  }

  static async saveGalleryItem(item: GalleryItem) {
    this.checkAdminAuth();
    const gallery = this.getGallery(true);
    const index = gallery.findIndex(g => String(g.id) === String(item.id));
    if (index > -1) gallery[index] = { ...item, deletedAt: null };
    else gallery.push(item);
    this.setStore('gallery', gallery);
  }

  static async deleteGalleryItem(id: string) {
    this.softDelete('gallery', id);
  }

  static async restoreGalleryItem(id: string) {
    this.restore('gallery', id);
  }

  static async permanentDeleteGalleryItem(id: string) {
    this.permanentDelete('gallery', id);
  }

  // --- Inquiries ---
  static getMessages(includeDeleted = false): ContactMessage[] {
    const items = this.getStore('contact_messages', INITIAL_MESSAGES);
    return includeDeleted ? items : items.filter((m: ContactMessage) => !m.deletedAt);
  }

  static async saveMessage(msg: Partial<ContactMessage>) {
    const messages = this.getMessages(true);
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      name: msg.name || '',
      email: msg.email || '',
      subject: msg.subject || '',
      message: msg.message || '',
      date: msg.date || new Date().toISOString(),
      status: 'new',
      replies: []
    };
    messages.push(newMessage);
    this.setStore('contact_messages', messages);
  }

  static async markAsRead(id: string) {
    this.checkAdminAuth();
    const messages = this.getMessages(true);
    const index = messages.findIndex(m => String(m.id) === String(id));
    if (index > -1 && messages[index].status === 'new') {
      messages[index].status = 'read';
      this.setStore('contact_messages', messages);
    }
  }

  static async replyToMessage(id: string, text: string) {
    this.checkAdminAuth();
    const messages = this.getMessages(true);
    const index = messages.findIndex(m => String(m.id) === String(id));
    if (index > -1) {
      const adminStr = localStorage.getItem('adminUser');
      const admin = adminStr ? JSON.parse(adminStr) : {};
      const reply: ChatReply = {
        id: Date.now().toString(),
        adminName: admin.name || 'Administrator',
        text,
        timestamp: new Date().toISOString(),
        deliveryStatus: 'delivered'
      };
      messages[index].replies.push(reply);
      messages[index].status = 'replied';
      this.setStore('contact_messages', messages);
    }
  }

  static async deleteMessage(id: string) {
    this.checkAdminAuth();
    this.permanentDelete('contact_messages', id);
  }

  static getMessageStats() {
    const messages = this.getMessages();
    return {
      total: messages.length,
      new: messages.filter(m => m.status === 'new').length,
      unread: messages.filter(m => m.status === 'new').length,
      replied: messages.filter(m => m.status === 'replied').length
    };
  }

  static getHomeConfig(): HomeConfig {
    return this.getStore('home_config', {
      heroTitle: 'Excellence in Education',
      heroSubtitle: 'Empowering students to achieve their full potential through holistic learning and character building.',
      heroImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=1920',
      schoolBrief: 'ES GISHOMA is a leading educational institution dedicated to providing a transformative learning experience.'
    });
  }

  static trackPageView(path: string) {
    const data = this.getStore('traffic_stats', {
      totalVisitors: 0,
      pageViews: {},
      dailyTrends: [],
      activeVisitors: 0
    });
    data.totalVisitors++;
    data.pageViews[path] = (data.pageViews[path] || 0) + 1;
    const today = new Date().toISOString().split('T')[0];
    const trendIndex = data.dailyTrends.findIndex((t: any) => String(t.date) === String(today));
    if (trendIndex > -1) {
      data.dailyTrends[trendIndex].views++;
    } else {
      data.dailyTrends.push({ date: today, views: 1 });
      if (data.dailyTrends.length > 30) data.dailyTrends.shift();
    }
    data.activeVisitors = Math.floor(Math.random() * 50) + 10;
    this.setStore('traffic_stats', data);
  }

  static getTrafficStats(): TrafficData {
    return this.getStore('traffic_stats', {
      totalVisitors: 0,
      pageViews: {},
      dailyTrends: [],
      activeVisitors: 0
    });
  }

  static async getSystemDiagnostics(): Promise<DiagnosticResult[]> {
    this.checkAdminAuth();
    await new Promise(r => setTimeout(r, 1200));
    return [
      { id: '1', label: 'Primary Node', value: 'Active', status: 'ok', description: 'Main communication cluster is operational.' },
      { id: '2', label: 'DB Latency', value: '14ms', status: 'ok', description: 'Data storage response time is healthy.' },
      { id: '3', label: 'MX Lookup', value: 'Verified', status: 'ok', description: 'Email routing services are healthy.' }
    ];
  }

  static async generateAISuggestion(text: string): Promise<string> {
    this.checkAdminAuth();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a professional response to this inquiry: "${text}"`,
      config: {
        systemInstruction: "You are a professional school administrator. Keep your response formal and helpful."
      }
    });
    return response.text || "Thank you for your inquiry.";
  }
}