
import React, { useState, useEffect } from 'react';
import { ClipboardList, Award, Calendar, FileText, CheckCircle2, AlertCircle, Download, Search, Loader2 } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { PastPaper } from '../types';

export default function Examinations() {
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await MockDB.getPastPapers();
        setPastPapers(data);
      } catch (e) {
        console.error("Failed to load past papers", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPapers = pastPapers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.level.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const examGuidelines = [
    {
      title: "Preparation",
      description: "Students must arrive at the examination hall at least 30 minutes before the scheduled start time.",
      icon: Calendar
    },
    {
      title: "Materials",
      description: "Only approved stationery and calculators are allowed. Mobile phones and smartwatches are strictly prohibited.",
      icon: FileText
    },
    {
      title: "Conduct",
      description: "Silence must be maintained throughout the examination. Any form of malpractice will lead to immediate disqualification.",
      icon: AlertCircle
    }
  ];

  const upcomingExams = [
    {
      subject: "Advanced Mathematics",
      date: "May 15, 2024",
      time: "09:00 AM - 12:00 PM",
      level: "Senior 6"
    },
    {
      subject: "Computer Science",
      date: "May 17, 2024",
      time: "02:00 PM - 05:00 PM",
      level: "Senior 5 & 6"
    },
    {
      subject: "Physics Practical",
      date: "May 20, 2024",
      time: "08:30 AM - 11:30 AM",
      level: "Senior 4"
    }
  ];

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
        {/* Guidelines Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {examGuidelines.map((guide, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <guide.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 brand-font">{guide.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {guide.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Upcoming Schedule */}
          <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-xl border border-slate-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 brand-font">Upcoming Schedule</h2>
            </div>
            
            <div className="space-y-6">
              {upcomingExams.map((exam, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-900">{exam.subject}</h4>
                    <p className="text-sm text-slate-500 font-medium">{exam.level} • {exam.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">{exam.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results & Grading */}
          <div className="bg-slate-900 p-8 sm:p-10 rounded-[3rem] shadow-xl text-white">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold brand-font">Grading System</h2>
            </div>
            
            <p className="text-slate-400 mb-8 font-medium">
              ES GISHOMA follows the national grading standards to ensure fair and transparent assessment of student performance.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { grade: 'A', desc: 'Excellent (80-100)' },
                { grade: 'B', desc: 'Very Good (70-79)' },
                { grade: 'C', desc: 'Good (60-69)' },
                { grade: 'D', desc: 'Satisfactory (50-59)' },
                { grade: 'E', desc: 'Pass (40-49)' },
                { grade: 'F', desc: 'Fail (Below 40)' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center space-x-4">
                  <span className="text-2xl font-black text-indigo-400">{item.grade}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-start space-x-4">
              <CheckCircle2 className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Results Portal</h4>
                <p className="text-sm text-slate-300">Students can access their detailed performance reports through the student portal using their unique ID.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Past Papers Section */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 brand-font mb-2">Past Papers</h2>
              <p className="text-slate-500 font-medium">Access our archive of previous national and internal examinations.</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by subject, year or level..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all outline-none bg-white font-medium shadow-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
               <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Archives...</p>
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPapers.map((paper) => (
                <div key={paper.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-100 group transition-all duration-500 flex flex-col">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-indigo-600 font-black tracking-widest uppercase text-[10px]">{paper.subject}</span>
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{paper.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 brand-font">{paper.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                      Official past paper for {paper.level} students. Useful for revision and exam preparation.
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-50 mt-auto flex items-center justify-between">
                    <div className="text-xs text-slate-400 font-bold uppercase truncate max-w-[120px]">{paper.fileName}</div>
                    <a 
                      href={paper.fileUrl} 
                      download={paper.fileName}
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
              <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 brand-font">No past papers found</h3>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto font-medium">Try adjusting your search term or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
