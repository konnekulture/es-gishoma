
import React, { useState, useEffect, FormEvent } from 'react';
import { Mail, Search, X, Send, Loader2, MessageSquare, Clock, CheckCircle2, AlertTriangle, Trash2, Reply, Sparkles, Filter, ChevronLeft, User, ShieldCheck, Inbox } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { ContactMessage } from '../../types';

export default function ManageMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const data = MockDB.getMessages();
    setMessages(data);
  };

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMsg(msg);
    setStatusMsg(null);
    if (msg.status === 'new') {
      try {
        await MockDB.markAsRead(msg.id);
        loadMessages();
      } catch (e) {
        console.error("Failed to mark as read", e);
      }
    }
  };

  const handleAISuggest = async () => {
    if (!selectedMsg) return;
    setIsSuggesting(true);
    try {
      const suggestion = await MockDB.generateAISuggestion(selectedMsg.message);
      setReplyText(suggestion);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'AI suggestion failed.' });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedMsg || !replyText.trim()) return;

    setIsSending(true);
    setStatusMsg(null);

    try {
      await MockDB.replyToMessage(selectedMsg.id, replyText);
      setStatusMsg({ type: 'success', text: 'Reply sent successfully.' });
      setReplyText('');
      loadMessages();
      const updatedMessages = MockDB.getMessages();
      const current = updatedMessages.find(m => String(m.id) === String(selectedMsg.id));
      if (current) setSelectedMsg(current);
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to send reply.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent | null, id: string) => {
    if (e) e.stopPropagation(); 
    
    if (!window.confirm('WARNING: This message will be permanently removed from all school archives. Proceed?')) return;
    
    setIsDeleting(true);
    setStatusMsg(null);

    try {
      await MockDB.deleteMessage(id);
      if (selectedMsg && String(selectedMsg.id) === String(id)) {
        setSelectedMsg(null);
      }
      loadMessages();
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
      (activeFilter === 'replied' && m.status === 'replied');
    return matchesSearch && matchesFilter;
  });

  const stats = MockDB.getMessageStats();

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
          {['all', 'new', 'replied'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
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
                    {msg.status === 'replied' ? (
                      <span className="text-[9px] sm:text-[10px] text-emerald-600 font-black uppercase flex items-center gap-1 shrink-0"><CheckCircle2 className="w-2.5 h-2.5" /> Replied</span>
                    ) : msg.status === 'new' ? (
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
              <p className="text-xs sm:text-sm mt-2 text-slate-400 text-center">View details and reply to inquiries from students and parents.</p>
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

                {selectedMsg.replies.map((rep) => (
                  <div key={rep.id} className="flex gap-3 sm:gap-4 justify-end">
                    <div className="max-w-[95%] sm:max-w-2xl">
                      <div className="bg-indigo-600 p-5 sm:p-6 rounded-2xl sm:rounded-3xl rounded-tr-none text-white shadow-xl shadow-indigo-100 relative">
                        <div className="flex items-center gap-2 mb-2 text-indigo-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Official Response</span>
                        </div>
                        <p className="leading-relaxed font-medium text-sm sm:text-base whitespace-pre-wrap break-words">{rep.text}</p>
                        <div className="absolute -bottom-5 right-0 flex flex-col items-end gap-0.5">
                           <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(rep.timestamp).toLocaleString()}</span>
                           <span className="text-[9px] sm:text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Delivered</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-100 items-center justify-center text-indigo-600 shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Reply Area */}
              <div className="p-4 sm:p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 shrink-0">
                <form onSubmit={handleReply} className="relative bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-[2rem] border border-slate-200 shadow-xl focus-within:ring-4 focus-within:ring-indigo-100/50 transition-all">
                  {statusMsg && (
                    <div className={`absolute -top-10 left-4 right-4 p-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-2 z-20 ${
                      statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {statusMsg.text}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2 px-1 gap-2">
                    <button 
                      type="button"
                      onClick={handleAISuggest}
                      disabled={isSuggesting}
                      className="flex items-center justify-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50 shrink-0"
                    >
                      {isSuggesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      AI Suggest
                    </button>
                  </div>
                  <textarea 
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official response..."
                    className="w-full p-2 sm:p-3 bg-transparent outline-none font-medium text-xs sm:text-sm min-h-[60px] sm:min-h-[100px] resize-none custom-scrollbar"
                  ></textarea>
                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="w-full sm:w-auto px-6 py-2.5 sm:px-8 sm:py-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 text-sm"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Dispatch Response</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
