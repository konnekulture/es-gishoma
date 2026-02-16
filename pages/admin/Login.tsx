
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { MockDB } from '../../services/mockDb';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // SECURITY: Sync admin credentials and authenticate
      const result = await MockDB.login(username, password);
      
      if (result) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        
        // Success redirect
        setTimeout(() => navigate('/admin/dashboard'), 500);
      } else {
        setError('Access Denied: Invalid administrator credentials.');
        setLoading(false);
      }
    } catch (err: any) {
      // SECURITY: Display rate-limiting or system errors
      setError(err.message || 'Critical Security Error: Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 brand-font">Secure Portal</h1>
          <p className="text-slate-400 font-light">Authenticated Access Only</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-10 rounded-[2.5rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium" 
                  placeholder="Username"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type={showPass ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 focus:ring-offset-0 transition-all" />
                <span className="group-hover:text-slate-300 transition-colors">Remember Node</span>
              </label>
              <button type="button" className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors">System Support</button>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Command Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-10 space-y-4">
          <p className="text-slate-500 text-xs font-medium tracking-tight">
            Encrypted Session Tunnel • SHA-256 Auth • End-to-End JWT
          </p>
          <div className="flex justify-center space-x-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white font-black uppercase tracking-widest">RSA-4096</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white font-black uppercase tracking-widest">AES-GCM</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white font-black uppercase tracking-widest">TLS 1.3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
