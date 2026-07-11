import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, MessageSquare, Inbox, ChevronRight, ShieldCheck, Clock, RefreshCw, LogOut } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { ContactMessage } from '../types';

export default function Contact() {
  const [activeTab, setActiveTab] = useState<'send' | 'dashboard'>('send');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  // Dashboard State
  const [dashboardEmail, setDashboardEmail] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userMessages, setUserMessages] = useState<ContactMessage[]>([]);
  const [selectedUserMsg, setSelectedUserMsg] = useState<ContactMessage | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await MockDB.saveMessage({
        name,
        email,
        subject,
        message,
        date: new Date().toISOString()
      });
      setSubmitted(true);
      // Reset
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashboardEmail.trim()) return;
    setIsSearching(true);
    try {
      const msgs = await MockDB.getUserMessagesByEmail(dashboardEmail);
      setUserMessages(msgs);
      setUserEmail(dashboardEmail);
      setSelectedUserMsg(null);
    } catch (err: any) {
      alert(err.message || 'Failed to search messages.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefreshDashboard = async () => {
    if (!userEmail) return;
    setIsSearching(true);
    try {
      const msgs = await MockDB.getUserMessagesByEmail(userEmail);
      setUserMessages(msgs);
      if (selectedUserMsg) {
        const updated = msgs.find(m => String(m.id) === String(selectedUserMsg.id));
        if (updated) setSelectedUserMsg(updated);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogoutDashboard = () => {
    setUserEmail('');
    setUserMessages([]);
    setSelectedUserMsg(null);
  };

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 py-24 text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-6 font-sans tracking-tight">Get In Touch</h1>
        <p className="text-indigo-100 text-xl font-light max-w-2xl mx-auto">Have questions or want to check your official administrative replies? We are here to support you.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Visit Us</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">ES GISHOMA Campus, Gishoma Sector, Rusizi District, Western Province, Rwanda</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">+250 788 123 456<br />Mon-Fri, 8:00 AM - 5:00 PM</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">info@esgishoma.ac.rw<br />admissions@esgishoma.ac.rw</p>
            </div>
          </div>

          {/* Core Interactive Form Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              
              {/* Tab Navigation */}
              <div className="flex border border-slate-100 mb-8 p-1.5 bg-slate-50/80 rounded-2xl shrink-0">
                <button
                  onClick={() => { setActiveTab('send'); setSubmitted(false); }}
                  className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-2 ${
                    activeTab === 'send'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Send a Message
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 py-3 text-center rounded-xl font-bold transition-all text-xs sm:text-sm flex items-center justify-center gap-2 ${
                    activeTab === 'dashboard'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Replies Dashboard
                </button>
              </div>

              {/* TAB 1: SEND A MESSAGE */}
              {activeTab === 'send' && (
                submitted ? (
                  <div className="text-center py-16 animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle className="w-12 h-12" />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Message Dispatched!</h2>
                    <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">Your message was securely sent. You can check for responses right here in the <strong>Replies Dashboard</strong> tab under your email address.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <button onClick={() => setSubmitted(false)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-sm">
                        Send another message
                      </button>
                      <button onClick={() => { setDashboardEmail(email); setActiveTab('dashboard'); }} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-300">
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Send an Inquiry</h2>
                    <p className="text-slate-500 mb-8 text-sm">Fill out the form below to reach the ES GISHOMA administrative office directly.</p>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                        <input 
                          required 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium text-sm" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                        <input 
                          required 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium text-sm" 
                          placeholder="your-email@example.com" 
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                        <select 
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium text-sm"
                        >
                          <option>General Inquiry</option>
                          <option>Admissions</option>
                          <option>Academics</option>
                          <option>Technical Support</option>
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Message</label>
                        <textarea 
                          required 
                          rows={5} 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium text-sm" 
                          placeholder="How can we help you today?"
                        ></textarea>
                      </div>
                      <div className="md:col-span-2 pt-2">
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 text-base disabled:opacity-50"
                        >
                          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Message</span>}
                          {!isSubmitting && <Send className="w-4 h-4" />}
                        </button>
                      </div>
                    </form>
                  </div>
                )
              )}

              {/* TAB 2: REPLIES DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="animate-in fade-in duration-300">
                  {/* Dashboard Login/Verification Screen */}
                  {!userEmail ? (
                    <div className="text-center py-10 max-w-md mx-auto">
                      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 mb-2">My Inquiry Dashboard</h2>
                      <p className="text-slate-500 mb-8 text-sm">Enter your registered email address to check past conversations and administrative replies.</p>
                      
                      <form onSubmit={handleAccessDashboard} className="space-y-4">
                        <div className="space-y-1 text-left">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Email</label>
                          <input 
                            required 
                            type="email" 
                            value={dashboardEmail}
                            onChange={(e) => setDashboardEmail(e.target.value)}
                            className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium text-sm text-center" 
                            placeholder="your-email@example.com" 
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={isSearching}
                          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
                        >
                          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Access Dashboard</span>}
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Dashboard Active Session Screen */
                    <div className="space-y-6">
                      {/* Active Session Info Bar */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Viewing Conversations For</p>
                          <p className="text-sm font-black text-slate-700 truncate">{userEmail}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button 
                            onClick={handleRefreshDashboard}
                            disabled={isSearching}
                            title="Refresh Responses"
                            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition-all shrink-0 flex items-center justify-center"
                          >
                            <RefreshCw className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
                          </button>
                          <button 
                            onClick={handleLogoutDashboard}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl text-red-600 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Exit</span>
                          </button>
                        </div>
                      </div>

                      {/* Thread View */}
                      {selectedUserMsg ? (
                        <div className="border border-slate-100 rounded-2xl p-4 sm:p-6 bg-white space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                          <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                            <div>
                              <button onClick={() => setSelectedUserMsg(null)} className="text-indigo-600 font-bold hover:text-indigo-800 text-xs flex items-center gap-1.5 mb-2 transition-all">
                                &larr; Back to conversations
                              </button>
                              <h3 className="text-lg sm:text-xl font-bold text-slate-900">{selectedUserMsg.subject}</h3>
                              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{new Date(selectedUserMsg.date).toLocaleString()}</p>
                            </div>
                            <div className="shrink-0">
                              {selectedUserMsg.status === 'replied' ? (
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase px-2.5 py-1 rounded-md">Replied</span>
                              ) : (
                                <span className="bg-slate-50 text-slate-500 border border-slate-100 text-[9px] font-black uppercase px-2.5 py-1 rounded-md">Submitted</span>
                              )}
                            </div>
                          </div>

                          {/* Original Message */}
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Inquiry</p>
                            <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed font-medium text-sm whitespace-pre-wrap break-words border border-slate-100">
                              {selectedUserMsg.message}
                            </div>
                          </div>

                          {/* Replies Area */}
                          <div className="space-y-4 pt-2">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Administrative Responses</p>
                            
                            {selectedUserMsg.replies && selectedUserMsg.replies.length > 0 ? (
                              <div className="space-y-4">
                                {selectedUserMsg.replies.map((rep) => (
                                  <div key={rep.id} className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 relative">
                                    <div className="flex items-center justify-between mb-3 text-indigo-600">
                                      <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                        <span className="text-xs font-black uppercase tracking-wider">{rep.adminName}</span>
                                        <span className="text-[10px] text-slate-500 font-bold truncate">({rep.adminEmail || 'ruzimarwanda@gmail.com'})</span>
                                      </div>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(rep.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-800 leading-relaxed font-medium text-sm whitespace-pre-wrap break-words">{rep.text}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                                <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-slate-500 font-bold text-sm">No reply from the school yet.</p>
                                <p className="text-slate-400 text-xs mt-1">Our administrative officers will process your inquiry soon. Check back again or refresh later!</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* List of user messages */
                        <div className="space-y-4">
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            My Submissions <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full">{userMessages.length}</span>
                          </h3>
                          
                          {userMessages.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                              {userMessages.map((msg) => (
                                <div 
                                  key={msg.id}
                                  onClick={() => setSelectedUserMsg(msg)}
                                  className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md cursor-pointer transition-all flex justify-between items-center group relative"
                                >
                                  <div className="min-w-0 flex-1 pr-4">
                                    <div className="flex items-center gap-2.5 mb-1.5">
                                      <span className="text-xs font-bold text-slate-400">{new Date(msg.date).toLocaleDateString()}</span>
                                      {msg.status === 'replied' ? (
                                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <CheckCircle className="w-2.5 h-2.5" /> Replied
                                        </span>
                                      ) : (
                                        <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[8px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5" /> Pending Review
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{msg.subject}</h4>
                                    <p className="text-xs text-slate-500 truncate mt-1 leading-relaxed">{msg.message}</p>
                                  </div>
                                  <div className="shrink-0 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-16 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                              <p className="text-slate-500 font-bold text-sm">No conversations found</p>
                              <p className="text-slate-400 text-xs mt-1">We couldn't find any inquiries sent from {userEmail}. Send a message using the tab above to get started!</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
