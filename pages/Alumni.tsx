
import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Globe, Briefcase, Heart, MessageSquare, ArrowRight, Loader2, X, CheckCircle2, Mail, User, Calendar, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MockDB } from '../services/mockDb';
import { AlumniStory } from '../types';

export default function Alumni() {
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    classYear: '',
    currentRole: '',
    instagram: ''
  });

  useEffect(() => {
    const data = MockDB.getAlumniStories();
    setStories(data);
    setLoading(false);
  }, []);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await MockDB.submitAlumniJoinRequest(formData);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitted(false);
        setFormData({ name: '', email: '', classYear: '', currentRole: '', instagram: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const stats = [
    { label: "Global Alumni", value: "5,000+", icon: Globe },
    { label: "Success Stories", value: "200+", icon: Heart },
    { label: "Countries", value: "15+", icon: Globe },
    { label: "Mentors", value: "150+", icon: Users },
  ];

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-700 pt-32 pb-48 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 brand-font relative z-10">Alumni Network</h1>
        <p className="text-indigo-100 text-lg sm:text-xl font-light relative z-10 max-w-2xl mx-auto">
          Connecting generations of excellence. Once a student, always a part of the ES GISHOMA family.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center group hover:bg-indigo-600 transition-all duration-500">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 group-hover:text-white transition-colors">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-white transition-colors">{stat.value}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-100 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Stories */}
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center brand-font">Alumni Spotlights</h2>
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={story.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 brand-font">{story.name}</h3>
                      <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">{story.classYear}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-slate-600 italic mb-6 font-medium text-sm leading-relaxed">
                    "{story.quote}"
                  </p>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{story.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Join the Network */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold brand-font mb-6">Stay Connected</h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
                Join our official alumni portal to network with fellow graduates, mentor current students, and stay updated on school developments.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold">Discussion Forums</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold">Job Board</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-bold">Mentorship</span>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20 flex items-center space-x-3 group"
              >
                <span>Join Alumni Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Join Portal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitted && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
            >
              {isSubmitted ? (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-slate-900 mb-4 brand-font">Welcome to the Family!</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Your request to join the alumni portal has been submitted. Our team will verify your details and send you an invitation link shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 brand-font">Join Alumni Portal</h2>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Registration Form</p>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleJoinSubmit} className="p-8 sm:p-10 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                        <User className="w-3 h-3 mr-2 text-indigo-500" /> Full Name
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                          <Mail className="w-3 h-3 mr-2 text-indigo-500" /> Email Address
                        </label>
                        <input 
                          required
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-2 text-indigo-500" /> Graduation Year
                        </label>
                        <input 
                          required
                          type="text" 
                          value={formData.classYear}
                          onChange={(e) => setFormData({...formData, classYear: e.target.value})}
                          className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                          placeholder="e.g. 2018"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                        <Briefcase className="w-3 h-3 mr-2 text-indigo-500" /> Current Role / Company
                      </label>
                      <input 
                        required
                        type="text" 
                        value={formData.currentRole}
                        onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                        placeholder="e.g. Software Engineer at Google"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                        <Instagram className="w-3 h-3 mr-2 text-indigo-500" /> Instagram Profile (Optional)
                      </label>
                      <input 
                        type="url" 
                        value={formData.instagram}
                        onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                        placeholder="https://instagram.com/username"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          <span>Submit Registration</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
