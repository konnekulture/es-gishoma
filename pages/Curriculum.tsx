
import React, { useState, useEffect } from 'react';
import { Book as BookIcon, Download, FileText, Search, Loader2 } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { Book } from '../types';

export default function Curriculum() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | Book['category']>('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await MockDB.getBooks();
        setBooks(data);
      } catch (e) {
        console.error("Failed to load books", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const categories: ('All' | Book['category'])[] = ['All', 'Sciences', 'ICT', 'Environment', 'Social Life'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      <div className="bg-indigo-700 pt-32 pb-48 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 brand-font relative z-10">Academic Curriculum</h1>
        <p className="text-indigo-100 text-lg sm:text-xl font-light relative z-10 max-w-2xl mx-auto">
          Explore our learning pathways and download official course materials for each department.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-24">
        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-12 flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search books, courses, or keywords..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium"
            />
          </div>
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
             <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Library Assets...</p>
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 group transition-all duration-500 flex flex-col">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <span className="text-indigo-600 font-black tracking-widest uppercase text-[10px] mb-2 block">{book.category}</span>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 brand-font">{book.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                    {book.description || "Official curriculum resource for students. Contains course syllabus and essential reading materials."}
                  </p>
                </div>
                <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-bold uppercase truncate max-w-[120px]">{book.fileName}</div>
                  <a 
                    href={book.fileUrl} 
                    download={book.fileName}
                    className="flex items-center space-x-2 text-indigo-600 font-bold group/btn hover:underline"
                  >
                    <span>Download PDF</span>
                    <Download className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] shadow-xl border border-slate-100">
            <BookIcon className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-400 brand-font">No matching resources</h3>
            <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">Try adjusting your category or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}
