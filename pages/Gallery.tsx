
import React, { useState, useEffect } from 'react';
import { X, Maximize2, Image as ImageIcon } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // FIX: getGallery is async and returns a promise.
    const loadGallery = async () => {
      const galleryData = await MockDB.getGallery();
      setItems(galleryData);
    };
    loadGallery();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="animate-in fade-in duration-500 pb-24 bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 pt-32 pb-48 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 brand-font relative z-10">Visual Archive</h1>
        <p className="text-indigo-100 text-lg sm:text-xl font-light relative z-10 max-w-2xl mx-auto">Capturing the moments that define the ES GISHOMA experience.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10">
        {items.length > 0 ? (
          <>
            <div className="bg-white p-4 rounded-3xl shadow-xl flex flex-wrap justify-center gap-2 sm:gap-4 mb-12 border border-slate-100">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                    filter === cat 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-video sm:aspect-square overflow-hidden rounded-[2.5rem] group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-slate-100"
                  onClick={() => setSelectedImage(item)}
                >
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-4 scale-50 group-hover:scale-100 transition-transform duration-500">
                       <Maximize2 className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-bold text-lg sm:text-xl leading-tight mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.caption}</p>
                    <span className="px-3 py-1 bg-indigo-500 rounded-full text-[9px] uppercase font-black text-white tracking-widest shadow-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-slate-100">
            <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-400 brand-font">Our Media Library is Fresh</h3>
            <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">We'll be uploading campus captures very soon.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 flex items-center justify-center p-4 sm:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedImage(null)}></div>
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all z-[110] backdrop-blur-xl border border-white/10"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="max-w-5xl w-full flex flex-col items-center relative z-[105]">
            <img src={selectedImage.url} alt={selectedImage.caption} className="w-full h-auto max-h-[75vh] object-contain rounded-2xl shadow-2xl" />
            <div className="mt-10 text-center px-4">
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2 brand-font leading-tight">{selectedImage.caption}</h4>
              <p className="text-indigo-400 font-black uppercase tracking-widest text-[10px] sm:text-xs bg-indigo-500/10 px-4 py-2 rounded-full inline-block border border-indigo-500/20">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
