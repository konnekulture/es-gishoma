import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { MockDB } from '../services/mockDb';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

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
      // Reset form fields
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

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 py-24 text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-6 font-sans tracking-tight">Get In Touch</h1>
        <p className="text-indigo-100 text-xl font-light max-w-2xl mx-auto">
          Have questions or want to reach the school administration? We are here to support you.
        </p>
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
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                ES GISHOMA Campus, Gishoma Sector, Rusizi District, Western Province, Rwanda
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                +250 788 123 456<br />Mon-Fri, 8:00 AM - 5:00 PM
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                info@esgishoma.ac.rw<br />admissions@esgishoma.ac.rw
              </p>
            </div>
          </div>

          {/* Core Interactive Form Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              
              {submitted ? (
                <div className="text-center py-16 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Message Dispatched!</h2>
                  <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
                    Your message was securely sent. Our administrative team will review your inquiry.
                  </p>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => setSubmitted(false)} 
                      className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Send an Inquiry</h2>
                  <p className="text-slate-500 mb-8 text-sm">
                    Fill out the form below to reach the ES GISHOMA administrative office directly.
                  </p>
                  
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
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 text-base disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Message</span>}
                        {!isSubmitting && <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
