
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { MockDB } from '../services/mockDb';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
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
      // Reset
      setName('');
      setEmail('');
      setSubject('General Inquiry');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 py-24 text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-6">Get In Touch</h1>
        <p className="text-indigo-100 text-xl font-light">Have questions? We're here to help you every step of the way.</p>
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
              <p className="text-slate-500 leading-relaxed">123 Academic Way, Education District, NY 10001, USA</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
              <p className="text-slate-500 leading-relaxed">+1 (555) 123-4567<br />Mon-Fri, 8am-4pm</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
              <p className="text-slate-500 leading-relaxed">info@esgishoma.edu<br />admissions@esgishoma.edu</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
              {submitted ? (
                <div className="text-center py-20 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">Message Sent!</h2>
                  <p className="text-slate-500 text-lg">Thank you for reaching out. Our team will get back to you shortly.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-10 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-slate-900 mb-10">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                      <input 
                        required 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-slate-50" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-slate-50" 
                        placeholder="john@example.com" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                      <select 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-slate-50 appearance-none"
                      >
                        <option>General Inquiry</option>
                        <option>Admissions</option>
                        <option>Academics</option>
                        <option>Technical Support</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Your Message</label>
                      <textarea 
                        required 
                        rows={5} 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-slate-50" 
                        placeholder="Tell us how we can help..."
                      ></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 text-lg disabled:opacity-50"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Message</span>}
                        {!isSubmitting && <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}