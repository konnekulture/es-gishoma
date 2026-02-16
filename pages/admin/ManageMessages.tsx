
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
    <div className="animate-in fade-in duration-500 h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] lg:h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 flex items-center gap-3">
            Inquiries <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full">{stats.unread} New</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">Official school communication hub.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {['all', 'new', 'replied'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex gap-0 lg:gap-6 overflow-hidden relative">
        {/* List Sidebar */}
        <div className={`w-full lg:w-1/3 bg-white rounded-[2rem] border border-slate-100 flex flex-col shadow-sm overflow-hidden ${selectedMsg ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 sm:p-6 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search inbox..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-50 font-medium text-xs transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((msg) => (
              <div 
                key={msg.id} 
                onClick={() => handleSelectMessage(msg)}
                className={`group p-4 sm:p-6 border-b border-slate-50 cursor-pointer transition-all flex items-start gap-4 relative ${
                  selectedMsg?.id === msg.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'
                } ${msg.status === 'new' ? 'bg-white' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.status === 'new' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-10">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm truncate ${msg.status === 'new' ? 'font-black text-slate-900' : 'font-bold text-slate-700'}`}>{msg.name}</span>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">{new Date(msg.date).toLocaleDateString()}</span>
                  </div>
                  <p className={`text-xs mb-2 truncate ${msg.status === 'new' ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{msg.subject}</p>
                  <div className="flex items-center gap-2">
                    {msg.status === 'replied' ? (
                      <span className="text-[10px] text-emerald-600 font-black uppercase flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Replied</span>
                    ) : msg.status === 'new' ? (
                      <span className="text-[10px] text-amber-600 font-black uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Unread</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-black uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Read</span>
                    )}
                  </div>
                </div>
                {/* Delete Button always visible on mobile/tablets, hover on desktop */}
                <button 
                  onClick={(e) => handleDelete(e, msg.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-all z-20"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-20 text-center opacity-40">
                <Inbox className="w-12 h-12 mx-auto mb-4" />
                <p className="font-bold">Inbox Clean</p>
              </div>
            )}
          </div>
        </div>

        {/* Message Content Area */}
        <div className={`flex-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative ${selectedMsg ? 'flex' : 'hidden lg:flex'}`}>
          {!selectedMsg ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold">Select a message</h3>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-4 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <button onClick={() => setSelectedMsg(null)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 items-center justify-center font-black flex-shrink-0">
                    {selectedMsg.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate">{selectedMsg.subject}</h2>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold truncate">{selectedMsg.name} &lt;{selectedMsg.email}&gt;</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                  <button 
                    onClick={(e) => handleDelete(e, selectedMsg.id)} 
                    disabled={isDeleting}
                    className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50 font-bold text-[10px] uppercase tracking-widest border border-red-50"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Thread Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-8 sm:space-y-10">
                <div className="flex gap-3 sm:gap-4 max-w-[90%] sm:max-w-2xl">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-slate-100 items-center justify-center text-slate-400 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl rounded-tl-none border border-slate-100 relative shadow-sm">
                      <p className="text-slate-700 leading-relaxed font-medium text-sm sm:text-base">{selectedMsg.message}</p>
                      <span className="absolute -bottom-6 left-0 text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(selectedMsg.date).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {selectedMsg.replies.map((rep) => (
                  <div key={rep.id} className="flex gap-3 sm:gap-4 justify-end">
                    <div className="max-w-[90%] sm:max-w-2xl">
                      <div className="bg-indigo-600 p-4 sm:p-6 rounded-3xl rounded-tr-none text-white shadow-xl shadow-indigo-100 relative">
                        <div className="flex items-center gap-2 mb-2 text-indigo-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Official Response</span>
                        </div>
                        <p className="leading-relaxed font-medium text-sm sm:text-base">{rep.text}</p>
                        <div className="absolute -bottom-6 right-0 flex flex-col items-end gap-1">
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(rep.timestamp).toLocaleString()}</span>
                           <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Delivered</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-100 items-center justify-center text-indigo-600 flex-shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Reply Area */}
              <div className="p-4 sm:p-8 bg-slate-50/50 border-t border-slate-100">
                <form onSubmit={handleReply} className="relative bg-white p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-xl focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                  {statusMsg && (
                    <div className={`absolute -top-10 left-0 right-0 p-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 animate-in slide-in-from-top-2 ${
                      statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {statusMsg.text}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 px-1 gap-2">
                    <button 
                      type="button"
                      onClick={handleAISuggest}
                      disabled={isSuggesting}
                      className="flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all disabled:opacity-50"
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
                    className="w-full p-2 sm:p-4 bg-transparent outline-none font-medium text-sm min-h-[60px] sm:min-h-[80px] resize-none"
                  ></textarea>
                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSending || !replyText.trim()}
                      className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Send</span>
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
