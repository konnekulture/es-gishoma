
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  category: 'Event' | 'News' | 'Urgent' | 'Academic';
  isFeatured?: boolean;
  deletedAt?: string | null;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  department: string;
  email: string;
  deletedAt?: string | null;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: string;
  isFeatured?: boolean;
  deletedAt?: string | null;
}

export interface Book {
  id: string;
  title: string;
  category: 'Sciences' | 'ICT' | 'Environment' | 'Social Life';
  fileUrl: string;
  fileName: string;
  description?: string;
  deletedAt?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface HomeConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  schoolBrief: string;
}

export interface DiagnosticResult {
  id: string;
  label: string;
  value: string;
  status: 'ok' | 'warning' | 'error';
  description: string;
}

export type MessageStatus = 'new' | 'read' | 'replied' | 'failed';

export interface ChatReply {
  id: string;
  adminName: string;
  text: string;
  timestamp: string;
  deliveryStatus: 'delivered' | 'failed';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
  replies: ChatReply[];
  deletedAt?: string | null;
}
