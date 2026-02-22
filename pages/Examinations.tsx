
import React, { useState, useEffect } from 'react';
import { ClipboardList, Award, Calendar, FileText, CheckCircle2, AlertCircle, Download, Search, Loader2, Filter, ChevronRight } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { PastPaper, ALevelSection } from '../types';

export default function Examinations() {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [alevelSections, setAlevelSections] = useState<ALevelSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDivision, setActiveDivision] = useState<'O-Level' | 'A-Level'>('O-Level');
  const [activeSection, setActiveSection] = useState<string>('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [papers, sections] = await Promise.all([
          MockDB.getPastPapers(),
          MockDB.getALevelSections()
        ]);
        setPastPapers(papers);
        setAlevelSections(sections);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPapers = pastPapers.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDivision = p.division === activeDivision;
    const matchesSection = activeDivision === 'O-Level' || activeSection === 'All' || p.section === activeSection;
    return matchesSearch && matchesDivision && matchesSection;
  });
  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-indigo-700 pt-32 pb-48 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 brand-font relative z-10">Examinations & Assessment</h1>
        <p className="text-indigo-100 text-lg sm:text-xl font-light relative z-10 max-w-2xl mx-auto">
          Maintaining high standards of academic integrity and excellence through rigorous evaluation.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-10 pb-24">
        {/* Past Papers Section */}
        <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 brand-font mb-2">Past Examinations</h2>
              <p className="text-slate-500 font-medium">Access our comprehensive archive of previous examinations.</p>
            </div>
            
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by exam title..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-slate-50 font-medium"
              />
            </div>
          </div>

          {/* Division Tabs */}
          <div className="flex flex-wrap gap-4 mb-10">
            {(['O-Level', 'A-Level'] as const).map(div => (
              <button
                key={div}
                onClick={() => {
                  setActiveDivision(div);
                  setActiveSection('All');
                }}
                className={`px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                  activeDivision === div 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' 
                  : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {div}
              </button>
            ))}
          </div>

          {/* A-Level Sections Filter */}
          {activeDivision === 'A-Level' && (
            <div className="flex flex-wrap gap-3 mb-10 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
              <div className="w-full text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 px-2">Filter by Section</div>
              <button
                onClick={() => setActiveSection('All')}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'All' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white text-slate-500 hover:bg-indigo-100 border border-slate-100'
                }`}
              >
                All Sections
              </button>
              {alevelSections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.name)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeSection === sec.name 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white text-slate-500 hover:bg-indigo-100 border border-slate-100'
                  }`}
                >
                  {sec.name}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center space-y-4">
               <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Archives...</p>
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredPapers.map((paper) => (
                <div key={paper.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 group transition-all duration-500 flex flex-col">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-indigo-600 font-black tracking-widest uppercase text-[10px]">{paper.division}</span>
                        {paper.section && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-indigo-400 font-black tracking-widest uppercase text-[10px]">{paper.section}</span>
                          </>
                        )}
                      </div>
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{paper.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 brand-font leading-tight">{paper.title}</h3>
                    <div className="flex items-center space-x-2 mb-6">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500">{paper.subject}</span>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                    <div className="text-[10px] text-slate-400 font-bold uppercase truncate max-w-[120px]">{paper.fileName}</div>
                    <a 
                      href={paper.fileUrl} 
                      download={paper.fileName}
                      className="flex items-center space-x-2 text-indigo-600 font-bold group/btn hover:underline"
                    >
                      <span className="text-sm">Download</span>
                      <Download className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 brand-font">No past papers found</h3>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
