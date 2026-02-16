
import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { Announcement } from '../types';

export default function Announcements() {
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setAnns(MockDB.getAnnouncements());
  }, []);

  const categories = ['All', 'Academic', 'Event', 'Urgent', 'News'];

  const filtered = anns.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="animate-in fade-in duration-500 min-h-screen bg-slate-50">
      <div className="bg-indigo-600 pt-32 pb-48 text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-6">School News & Updates</h1>
        <p className="text-indigo-100 text-xl font-light">Stay informed about everything happening at ES GISHOMA.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 pb-24">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 mb-12 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search announcements..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filtered.length > 0 ? filtered.map((ann) => (
            <div key={ann.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 group transition-all duration-500 flex flex-col h-full">
              <div className="relative h-72 overflow-hidden">
                <img src={ann.image} alt={ann.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 flex space-x-2">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {ann.category}
                  </span>
                  {ann.isFeatured && (
                    <span className="bg-amber-400 px-4 py-1.5 rounded-full text-amber-900 text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center text-slate-400 text-sm mb-4 space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="font-medium">{new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{ann.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-1">
                  {ann.content}
                </p>
                <div className="pt-6 border-t border-slate-50 mt-auto">
                  <button className="flex items-center space-x-2 text-indigo-600 font-bold group/btn">
                    <span>Full Announcement</span>
                    <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-400">No matching announcements found</h3>
              <p className="text-slate-400 mt-2">Try adjusting your search filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}