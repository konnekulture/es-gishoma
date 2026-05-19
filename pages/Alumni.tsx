
import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Globe, Briefcase, Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { MockDB } from '../services/mockDb';
import { AlumniStory } from '../types';

export default function Alumni() {
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      const data = await MockDB.getAlumniStories();
      setStories(data);
      setLoading(false);
    };
    loadStories();
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
      </div>
    </div>
  );
}
