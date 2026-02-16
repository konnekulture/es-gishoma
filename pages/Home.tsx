
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Trophy, GraduationCap, Calendar, ChevronRight, Megaphone, Image as GalleryIcon, Maximize2 } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { Announcement, HomeConfig, GalleryItem } from '../types';

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [featuredGallery, setFeaturedGallery] = useState<GalleryItem[]>([]);
  const [config, setConfig] = useState<HomeConfig>(MockDB.getHomeConfig());

  useEffect(() => {
    setAnnouncements(MockDB.getAnnouncements().filter(a => a.isFeatured).slice(0, 3));
    setFeaturedGallery(MockDB.getGallery().filter(g => g.isFeatured).slice(0, 4));
  }, []);

  const stats = [
    { label: 'Students', value: '1,200+', icon: Users },
    { label: 'Teachers', value: '85+', icon: GraduationCap },
    { label: 'Awards', value: '50+', icon: Trophy },
    { label: 'Classes', value: '45', icon: BookOpen },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={config.heroImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {config.heroTitle}
            </h1>
            <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light">
              {config.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center group">
                Discover More <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links / Brief */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                alt="Students" 
                className="rounded-2xl shadow-2xl relative"
              />
              <div className="absolute -bottom-8 -right-8 bg-indigo-600 p-8 rounded-2xl shadow-xl text-white hidden md:block">
                <span className="text-4xl font-bold block">35+</span>
                <span className="text-sm uppercase tracking-widest font-semibold opacity-80">Years of Legacy</span>
              </div>
            </div>
            <div>
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4 block">Welcome to ES GISHOMA</span>
              <h2 className="text-4xl font-bold mb-8 text-slate-900 leading-tight">Investing In Our Student's Future</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {config.schoolBrief}
              </p>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center text-indigo-600">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500 uppercase font-semibold">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      {featuredGallery.length > 0 && (
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4 block">Campus Life</span>
              <h2 className="text-4xl font-bold text-slate-900">ES GISHOMA at a Glance</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGallery.map((item) => (
                <div key={item.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-lg leading-tight mb-2">{item.caption}</p>
                      <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] uppercase font-bold text-white tracking-widest backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link to="/gallery" className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                <GalleryIcon className="w-5 h-5" />
                <span>View Full Gallery</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Announcements */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Latest Announcements</h2>
              <p className="text-slate-500">Stay updated with our recent events and academic news.</p>
            </div>
            <Link to="/news" className="text-indigo-600 font-bold flex items-center group hover:underline">
              View All <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group hover:-translate-y-2 transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <img src={ann.image} alt={ann.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      {ann.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center text-slate-400 text-xs mb-3 space-x-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">{ann.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {ann.content}
                    </p>
                    <Link to="/news" className="text-indigo-600 font-bold text-sm flex items-center hover:text-indigo-700">
                      Read Story <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
              <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-400">No recent announcements</h3>
              <p className="text-slate-400 mt-2">Check back later for school updates and news.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Links CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden shadow-2xl shadow-indigo-200">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to join our community?</h2>
                <p className="text-indigo-100 text-lg opacity-90">Start your journey today. Inquire about admissions, schedule a tour, or talk to our counselors.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-slate-50 transition-all text-center">
                  Inquire Now
                </Link>
                <Link to="/staff" className="px-10 py-5 bg-indigo-700 text-white rounded-2xl font-bold hover:bg-indigo-800 transition-all text-center border border-indigo-500">
                  Our Faculty
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}