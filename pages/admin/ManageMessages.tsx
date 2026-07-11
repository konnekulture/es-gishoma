
import React, { useState, useEffect } from 'react';
import { Search, Loader2, MessageSquare, Clock, AlertTriangle, Trash2, ChevronLeft, User, Inbox, ShieldCheck } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { ContactMessage } from '../../types';

export default function ManageMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'read'>('all');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [stats, setStats] = useState({ total: 0, new: 0, unread: 0, replied: 0 });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    const data = await MockDB.getMessages();
    setMessages(data);
    const s = await MockDB.getMessageStats();
    setStats(s);
  };

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    if (msg.status === 'new') {
      try {
        await MockDB.markAsRead(msg.id);
        await loadMessages();
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation(); 
    
    if (!window.confirm('WARNING: This message will be permanently removed from all school archives. Proceed?')) return;
    
    setIsDeleting(true);

    try {
      await MockDB.deleteMessage(id);
      if (selectedMsg && String(selectedMsg.id) === String(id)) {
        setSelectedMsg(null);
      }
      await loadMessages();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Action Forbidden: Please verify your administrative credentials.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'new' && m.status === 'new') || 
      (activeFilter === 'read' && m.status === 'read');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] flex flex-col w-full max-w-full overflow-hidden">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0 px-1">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 mb-0.5 flex items-center gap-3">
            Inquiries <span className="bg-indigo-600 text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:py-1 rounded-full">{stats.unread} New</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Official school communication hub.</p>
        </div>
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar-hide">
          {['all', 'new', 'read'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f === 'new' ? 'unread' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-0 lg:gap-6 overflow-hidden relative min-h-0 w-full">
        {/* List Sidebar */}
        <div className={`w-full lg:w-1/3 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 flex flex-col shadow-sm overflow-hidden ${selectedMsg ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 border-b border-slate-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search inbox..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-50 font-medium text-[11px] sm:text-xs transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                className={`group p-4 sm:p-6 border-b border-slate-50 cursor-pointer transition-all flex items-start gap-3 sm:gap-4 relative ${
                  selectedMsg?.id === msg.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'
                } ${msg.status === 'new' ? 'bg-white font-bold' : ''}`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 shrink-0 ${
                  msg.status === 'new' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex justify-between items-center mb-0.5 sm:mb-1">
                    <span className={`text-[13px] sm:text-sm truncate pr-2 ${msg.status === 'new' ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>{msg.name}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 flex-shrink-0">{new Date(msg.date).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-[11px] sm:text-xs mb-1.5 sm:mb-2 truncate ${msg.status === 'new' ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{msg.subject}</p>
                  <div className="flex items-center gap-2">
                    {msg.status === 'new' ? (
                      <span className="text-[9px] sm:text-[10px] text-amber-600 font-black uppercase flex items-center gap-1 shrink-0"><AlertTriangle className="w-2.5 h-2.5" /> Unread</span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase flex items-center gap-1 shrink-0"><Clock className="w-2.5 h-2.5" /> Read</span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, msg.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all z-20"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-16 sm:p-20 text-center opacity-30">
                <Inbox className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" />
                <p className="font-bold text-sm">Inbox Clean</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Content Area */}
        <div className={`flex-1 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative ${selectedMsg ? 'flex' : 'hidden lg:flex'}`}>
          {!selectedMsg ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-6 sm:p-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Select a message</h3>
              <p className="text-xs sm:text-sm mt-2 text-slate-400 text-center">View details of inquiries from students, parents, and partners.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 sm:p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-white shrink-0 sticky top-0 z-10 w-full min-h-[70px] sm:min-h-[80px]">
                <div className="flex items-center gap-2 sm:gap-4 overflow-hidden flex-1">
                  <button onClick={() => setSelectedMsg(null)} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900 shrink-0 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="hidden sm:flex w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 text-indigo-600 items-center justify-center font-black flex-shrink-0 shrink-0">
                    {selectedMsg.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 truncate pr-2 sm:pr-4">{selectedMsg.subject}</h2>
                    <p className="text-[9px] sm:text-xs text-slate-500 font-bold truncate pr-2 sm:pr-4 leading-tight">{selectedMsg.name} &bull; {selectedMsg.email}</p>
                  </div>
                </div>
                <div className="shrink-0 ml-1 sm:ml-2">
                  <button 
                    onClick={(e) => handleDelete(e, selectedMsg.id)} 
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all disabled:opacity-50 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest border border-red-50"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Thread Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 space-y-10 sm:space-y-12 custom-scrollbar">
                <div className="flex gap-3 sm:gap-4 max-w-[95%] sm:max-w-2xl">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-100 items-center justify-center text-slate-400 shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl sm:rounded-3xl rounded-tl-none border border-slate-100 relative shadow-sm">
                      <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base whitespace-pre-wrap break-words">{selectedMsg.message}</p>
                      <span className="absolute -bottom-5 left-0 text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(selectedMsg.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
