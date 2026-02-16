
import React, { useState, useEffect } from 'react';
import { X, Maximize2, Search, Image as ImageIcon } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { GalleryItem } from '../types';

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    setItems(MockDB.getGallery());
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="animate-in fade-in duration-500 pb-24">
      <div className="bg-indigo-600 py-24 text-center px-4">
        <h1 className="text-5xl font-bold text-white mb-6">Visual Journey</h1>
        <p className="text-indigo-100 text-xl font-light">A glimpse into life, facilities, and events at ES GISHOMA.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {items.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                    filter === cat 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                    : 'bg-white text-slate-600 border border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((item) => (
                <div 
                  key={item.id} 
                  className="relative aspect-square overflow-hidden rounded-[2rem] group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                  onClick={() => setSelectedImage(item)}
                >
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-8 text-center">
                    <Maximize2 className="w-10 h-10 text-white mb-4 scale-50 group-hover:scale-100 transition-transform duration-500" />
                    <p className="text-white font-bold text-lg">{item.caption}</p>
                    <span className="mt-2 px-3 py-1 bg-white/20 rounded-full text-[10px] uppercase font-bold text-white tracking-widest">{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-slate-100">
            <ImageIcon className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-slate-400">Media Library is Empty</h3>
            <p className="text-slate-400 mt-4 max-w-md mx-auto">Captures from our campus and events will appear here as they are added.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-slate-950/95 flex items-center justify-center p-4 md:p-12 animate-in fade-in zoom-in-95 duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-8 right-8 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full max-h-full flex flex-col">
            <img src={selectedImage.url} alt={selectedImage.caption} className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
            <div className="mt-8 text-center">
              <h4 className="text-2xl font-bold text-white mb-2">{selectedImage.caption}</h4>
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}