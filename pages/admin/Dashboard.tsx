
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Megaphone, Users, Image as GalleryIcon, Eye, TrendingUp, AlertCircle, Clock, CheckCircle2, XCircle, Loader2, X, Activity, MousePointer2, MessageSquare } from 'lucide-react';
import { MockDB, TrafficData } from '../../services/mockDb';
import { DiagnosticResult } from '../../types';

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    announcements: 0,
    staff: 0,
    gallery: 0,
    totalVisitors: 0,
    activeVisitors: 0,
    newMessages: 0
  });

  const [trafficStats, setTrafficStats] = useState<TrafficData | null>(null);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[] | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // FIX: getGallery is async and returns a promise. We need an async function to await it.
    const loadStats = async () => {
      const tData = MockDB.getTrafficStats();
      const msgStats = MockDB.getMessageStats();
      const galleryItems = await MockDB.getGallery();
      setTrafficStats(tData);
      setStats({
        announcements: MockDB.getAnnouncements().length,
        staff: MockDB.getStaff().length,
        gallery: galleryItems.length,
        totalVisitors: tData.totalVisitors,
        activeVisitors: tData.activeVisitors,
        newMessages: msgStats.new
      });
    };
    loadStats();
  }, []);

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setShowDiagnosticModal(true);
    try {
      const results = await MockDB.getSystemDiagnostics();
      setDiagnosticResults(results);
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const cards = [
    { label: 'New Inquiries', value: stats.newMessages, icon: MessageSquare, color: 'bg-indigo-600' },
    { label: 'Active Sessions', value: stats.activeVisitors, icon: Activity, color: 'bg-emerald-500' },
    { label: 'Faculty Directory', value: stats.staff, icon: Users, color: 'bg-rose-500' },
    { label: 'Media Assets', value: stats.gallery, icon: GalleryIcon, color: 'bg-amber-500' },
  ];

  const pageViewData = trafficStats ? Object.entries(trafficStats.pageViews).map(([name, value]) => ({
    name: name === '/' ? 'Home' : name.replace('/', '').charAt(0).toUpperCase() + name.replace('/', '').slice(1),
    views: value
  })) : [];

  return (
    <div className="animate-in fade-in duration-500 w-full overflow-hidden">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Command Center</h1>
          <p className="text-slate-500 font-medium">Real-time system health and intelligence.</p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100 shrink-0">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
          </div>
          <div className="pr-4">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Network Status</div>
            <div className="text-sm font-bold text-slate-700 whitespace-nowrap">Nodes Operational</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-5 -translate-y-1/2 translate-x-1/2 rounded-full group-hover:scale-110 transition-transform`}></div>
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100 shrink-0`}>
              <card.icon className="w-7 h-7" />
            </div>
            <div className="text-3xl font-black text-slate-900 mb-2">{card.value.toLocaleString()}</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-stretch">
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900">Traffic Distribution</h3>
            <p className="text-sm text-slate-500 mt-1">Daily trends across public endpoints</p>
          </div>
          <div className="flex-1 min-h-[350px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficStats?.dailyTrends}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} 
                    dy={10} 
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-6 sm:p-10 rounded-[2.5rem] shadow-sm text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Maintenance Hub</h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {[
                { task: 'Communications Buffer', status: 'Secure', val: `${stats.newMessages} New` },
                { task: 'SMTP Dispatcher', status: 'Healthy', val: 'Online' },
                { task: 'Content Latency', status: 'Verified', val: '24ms' }
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-slate-200 text-sm truncate">{t.task}</div>
                    <div className="text-[10px] text-slate-500 font-black uppercase mt-1 tracking-widest">{t.status}</div>
                  </div>
                  <div className="text-indigo-400 font-black text-xs shrink-0">{t.val}</div>
                </div>
              ))}
            </div>

            <div className="pt-8 mt-auto">
              <button 
                onClick={runDiagnostics}
                disabled={isRunningDiagnostics}
                className="w-full py-5 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-700 transition-all text-sm flex items-center justify-center space-x-3 disabled:opacity-50 shadow-2xl shadow-indigo-900/40"
              >
                {isRunningDiagnostics ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    <span>Run Diagnostics</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 items-stretch">
        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
           <div className="flex items-center space-x-3 mb-8">
              <MousePointer2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900">Popularity Index</h3>
            </div>
            <div className="flex-1 min-h-[300px] w-full">
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViewData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                    <Bar dataKey="views" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
        </div>

        <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
           <div className="flex items-center space-x-3 mb-8">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-bold text-slate-900">Engagement Log</h3>
            </div>
            <div className="space-y-6 flex-1 overflow-y-auto max-h-[300px] pr-2">
              {[
                { page: 'Inquiry Response Dispatched', time: 'Just now', user: 'Admin System' },
                { page: 'External MX Lookup Success', time: '5 mins ago', user: 'Network Node' },
                { page: 'Faculty Search Query', time: '14 mins ago', user: 'Visitor #219' },
                { page: 'Gallery Asset Rendered', time: '22 mins ago', user: 'Visitor #221' },
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between group py-1">
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-bold text-slate-700 truncate">{act.page}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.user}</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-400 whitespace-nowrap">{act.time}</div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {showDiagnosticModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-900">System Health Scan</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">ES GISHOMA Cloud Engine v4.2</p>
              </div>
              <button 
                onClick={() => setShowDiagnosticModal(false)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {isRunningDiagnostics ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="text-center px-4">
                    <p className="text-lg font-bold text-slate-900">Analyzing Communications Node</p>
                    <p className="text-sm text-slate-500">Checking MX Lookup services and SMTP reliability...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {diagnosticResults?.map((res) => (
                    <div key={res.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-start gap-5">
                      <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                        res.status === 'ok' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                      } shrink-0`}>
                        {res.status === 'ok' ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <h4 className="font-bold text-slate-900 truncate">{res.label}</h4>
                          <span className={`text-sm font-black whitespace-nowrap ${res.status === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>{res.value}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{res.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowDiagnosticModal(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
              >
                Scan Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
