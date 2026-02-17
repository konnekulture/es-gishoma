
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Trophy, GraduationCap, Calendar, ChevronRight, Megaphone, Image as GalleryIcon } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { Announcement, HomeConfig, GalleryItem } from '../types';

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [featuredGallery, setFeaturedGallery] = useState<GalleryItem[]>([]);
  const [config, setConfig] = useState<HomeConfig>(MockDB.getHomeConfig());

  useEffect(() => {
    // FIX: getGallery is async and returns a promise. We need to await it.
    const loadAsyncData = async () => {
      setAnnouncements(MockDB.getAnnouncements().filter(a => a.isFeatured).slice(0, 3));
      const gallery = await MockDB.getGallery();
      setFeaturedGallery(gallery.filter(g => g.isFeatured).slice(0, 4));
    };
    loadAsyncData();
  }, []);

  const stats = [
    { label: 'Students', value: '1,200+', icon: Users },
    { label: 'Teachers', value: '85+', icon: GraduationCap },
    { label: 'Awards', value: '50+', icon: Trophy },
    { label: 'Classes', value: '45', icon: BookOpen },
  ];

  return (
    <div className="animate-in fade-in duration-500 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={config.heroImage} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 py-16 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight brand-font">
              {config.heroTitle}
            </h1>
            <p className="text-base sm:text-xl text-slate-200 mb-8 sm:mb-10 leading-relaxed font-light">
              {config.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about" className="px-6 py-3.5 sm:px-8 sm:py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center group">
                Discover More <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all text-center">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links / Brief */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                alt="Students" 
                className="rounded-3xl shadow-2xl relative w-full h-auto object-cover aspect-video sm:aspect-square md:aspect-video lg:aspect-square"
              />
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-indigo-600 px-5 py-5 sm:px-8 sm:py-8 rounded-2xl shadow-xl text-white hidden sm:block">
                <span className="text-3xl sm:text-4xl font-bold block">35+</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-black opacity-80">Years of Legacy</span>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-indigo-600 font-black tracking-[0.2em] uppercase text-xs mb-3 sm:mb-4 block">Welcome to ES GISHOMA</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-slate-900 leading-tight brand-font">Investing In Our Student's Future</h2>
              <p className="text-slate-600 text-sm sm:text-lg leading-relaxed mb-8 font-medium">
                {config.schoolBrief}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl sm:text-2xl font-black text-slate-900 truncate">{stat.value}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest truncate">{stat.label}</div>
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
        <section className="py-16 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="text-indigo-600 font-black tracking-[0.2em] uppercase text-[10px] mb-3 sm:mb-4 block">Campus Life</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 brand-font">ES GISHOMA at a Glance</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredGallery.slice(0, 3).map((item) => (
                <div key={item.id} className="group relative aspect-video sm:aspect-square rounded-[2rem] overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent flex items-end p-6 sm:p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-white font-bold text-base sm:text-lg leading-tight mb-2">{item.caption}</p>
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] sm:text-[10px] uppercase font-black text-white tracking-widest backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 text-center">
              <Link to="/gallery" className="inline-flex items-center space-x-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                <GalleryIcon className="w-5 h-5" />
                <span>View Full Gallery</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Announcements */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-10 sm:mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 brand-font">Latest Updates</h2>
              <p className="text-slate-500 font-medium">Stay informed about academic news and school events.</p>
            </div>
            <Link to="/news" className="text-indigo-600 font-bold flex items-center group hover:underline text-sm uppercase tracking-widest">
              View All <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 group hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <img src={ann.image} alt={ann.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      {ann.category}
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <div className="flex items-center text-slate-400 text-xs mb-3 space-x-2 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ann.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 line-clamp-2 brand-font group-hover:text-indigo-600 transition-colors">{ann.title}</h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">
                      {ann.content}
                    </p>
                    <Link to="/news" className="mt-auto text-indigo-600 font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center hover:text-indigo-700">
                      Read More <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 rounded-[2.5rem] p-12 sm:p-16 text-center border-2 border-dashed border-slate-200">
              <Megaphone className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Quiet for now...</h3>
              <p className="text-slate-400 mt-2">Check back later for fresh updates.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12 text-center lg:text-left">
              <div className="max-w-xl">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 brand-font leading-tight">Begin Your Educational Journey With Us</h2>
                <p className="text-slate-400 text-base sm:text-lg md:text-xl font-light">Join a community dedicated to innovation, character, and academic success.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/contact" className="px-8 py-4 sm:px-10 sm:py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all text-center shadow-xl shadow-indigo-900/40">
                  Enquire Now
                </Link>
                <Link to="/contact" className="px-8 py-4 sm:px-10 sm:py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold hover:bg-white/20 transition-all text-center">
                  Staff Access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
