
import React, { useState, useEffect } from 'react';
import { Mail, Briefcase, GraduationCap, Users } from 'lucide-react';
import { MockDB } from '../services/mockDb';
import { Staff } from '../types';

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);

  useEffect(() => {
    setStaff(MockDB.getStaff());
  }, []);

  return (
    <div className="animate-in fade-in duration-500 bg-slate-50 pb-24">
      <div className="bg-slate-900 pt-32 pb-48 text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-6">Our Faculty & Staff</h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">Meet the dedicated educators and professionals who inspire our students to reach their full potential every day.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-24">
        {staff.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {staff.map((member) => (
              <div key={member.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group">
                <div className="relative h-80 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <div className="text-white space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <p className="text-sm font-light italic opacity-90">"{member.bio}"</p>
                      <div className="flex space-x-4">
                        <a href={`mailto:${member.email}`} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <Mail className="w-5 h-5 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{member.name}</h3>
                    <div className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">{member.role}</div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm font-medium">{member.department} Department</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <GraduationCap className="w-5 h-5 text-indigo-400" />
                      <span className="text-sm font-medium">Verified Faculty Member</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-24 text-center shadow-xl border border-slate-100">
            <Users className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-slate-400">Faculty Directory Empty</h3>
            <p className="text-slate-400 mt-4 max-w-md mx-auto">Profiles of our educators and administration will be listed here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
