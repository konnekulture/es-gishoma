
import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Globe, Briefcase, Heart, MessageSquare, ArrowRight, Loader2 } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { AlumniStory } from '../types';

export default function Alumni() {
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = MockDB.getAlumniStories();
    setStories(data);
    setLoading(false);
  }, []);
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
              <button className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/20 flex items-center space-x-3 group">
                <span>Join Alumni Portal</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
