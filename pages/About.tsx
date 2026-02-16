
import React from 'react';
import { Target, Eye, Award, History, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1920')] opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Legacy & Purpose</h1>
          <p className="text-slate-300 text-xl max-w-3xl mx-auto font-light">Dedicated to cultivating excellence since 1985, building a foundation for lifelong learning and global leadership.</p>
        </div>
      </div>

      {/* History & Foundation */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center space-x-3 text-indigo-600 font-bold mb-4">
                <History className="w-5 h-5" />
                <span className="uppercase tracking-widest text-sm">Our Story</span>
              </div>
              <h2 className="text-4xl font-bold mb-8 text-slate-900 leading-tight">Decades of Academic Excellence</h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Founded in 1985 by a group of visionary educators, ES GISHOMA began with just 50 students and a single building. Our founding principle was simple: every child deserves an education that challenges their intellect while nurturing their character.
                </p>
                <p>
                  Today, we have grown into one of the region's most prestigious institutions, known for our innovative STEM programs, vibrant arts culture, and record-breaking athletic achievements.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-lg mt-8" alt="Old Campus" />
              <img src="https://images.unsplash.com/photo-1523050335392-93851179ae22?auto=format&fit=crop&q=80&w=800" className="rounded-2xl shadow-lg" alt="Science Lab" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-100">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-slate-900">Our Mission</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                To provide a stimulating learning environment that encourages high expectations for success through development-appropriate instruction that allows for individual differences and learning styles.
              </p>
              <ul className="space-y-4">
                {['Empowering critical thinking', 'Fostering moral integrity', 'Encouraging global citizenship'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-600 p-12 rounded-3xl shadow-xl text-white">
              <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-8">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold mb-6">Our Vision</h3>
              <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                To be a world-class educational hub that transforms students into resilient leaders, innovative thinkers, and compassionate members of society who shape a better world.
              </p>
              <div className="mt-12 p-8 bg-white/5 rounded-2xl border border-white/10">
                <div className="flex items-center space-x-4">
                  <Award className="w-12 h-12 text-indigo-300" />
                  <div>
                    <div className="text-2xl font-bold">Top Ranked</div>
                    <div className="text-indigo-200 text-sm">Academic Performance 2023</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}