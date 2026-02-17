
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Eye, EyeOff, ArrowRight, ShieldCheck, Fingerprint, ShieldAlert, Cpu } from 'lucide-react';
import { MockDB } from '../../services/mockDb';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Hidden field for bots
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Captcha State
  const [captcha, setCaptcha] = useState({ a: 0, b: 0, result: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, result: a + b });
    setCaptchaInput('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Basic Captcha Validation
    if (parseInt(captchaInput) !== captcha.result) {
      setError('Security verification failed. Please check the sum.');
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      const result = await MockDB.login(username, password, honeypot);
      
      if (result) {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        navigate('/admin/dashboard');
      } else {
        // Generic error to prevent user enumeration
        setError('Authentication failed. Invalid identity or security key.');
        setLoading(false);
        generateCaptcha();
      }
    } catch (err: any) {
      setError(err.message || 'Critical Security Error.');
      setLoading(false);
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/30 border border-indigo-400/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 brand-font tracking-tight">System Access</h1>
          <p className="text-slate-500 text-sm font-medium">ES GISHOMA Administrative Node</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 p-8 sm:p-10 rounded-[2.5rem] shadow-3xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}
            
            {/* Honeypot field - must be hidden from humans */}
            <div className="hidden" aria-hidden="true">
              <input 
                type="text" 
                tabIndex={-1} 
                autoComplete="off" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  required
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium placeholder-slate-700" 
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  required
                  type={showPass ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 text-white rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all font-medium placeholder-slate-700" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Math Captcha Verification */}
            <div className="space-y-2 bg-slate-950/30 p-5 rounded-2xl border border-slate-800/30">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Security Verification</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-center font-black text-indigo-400 text-lg">
                  {captcha.a} + {captcha.b} = ?
                </div>
                <div className="flex-[0.8]">
                  <input 
                    required
                    type="number"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    placeholder="Result"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-center outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-bold"
                  />
                </div>
              </div>
              <p className="text-[9px] text-slate-600 font-bold mt-3 text-center uppercase tracking-tighter italic">Solve the equation to verify human interaction</p>
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-3 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 opacity-70" />
                  <span>Authorize Session</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-4 text-slate-500">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <Cpu className="w-3 h-3 text-indigo-500" />
            <span>Secure Core V2.4</span>
          </div>
          <div className="flex justify-center gap-4 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white font-black uppercase tracking-widest">Brute-Force Shield</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white font-black uppercase tracking-widest">Bot Honeypot</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-white font-black uppercase tracking-widest">Lockout Policy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
