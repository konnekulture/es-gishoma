import React, { useEffect } from 'react';
import { Shield, Eye, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicy() {
  useEffect(() => {
    // Scroll to top on load
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="absolute h-96 w-96 -top-48 -left-48 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute h-96 w-96 -bottom-48 -right-48 bg-violet-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl mb-6 border border-indigo-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            At ES GISHOMA, we are committed to safeguarding the personal information and privacy of our students, staff, alumni, and website visitors.
          </p>
          <div className="mt-6 text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: May 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 mt-16 sm:mt-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-12">
          
          {/* Section 1 */}
          <div id="introduction" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">1</span>
              <span>Introduction</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              This Privacy Policy describes how ES GISHOMA ("we", "our", "us") collects, uses, stores, and protects your personal information when you access our official school portal or submit inquiries, alumni membership forms, or applications.
            </p>
            <p className="text-slate-600 leading-relaxed">
              By interacting with our platform, you acknowledge and agree to the data collection and usage practices described in this document.
            </p>
          </div>

          {/* Section 2 */}
          <div id="data-collection" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">2</span>
              <span>Information We Collect</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We collect information that you actively provide to us and information that is automatically generated during your sessions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Contact & Inquiry Forms</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Name, Email Address, Subject, and custom Message content sent through our web portals.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Alumni Join Requests</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Academic graduation class year, current professional roles, story details, and social channels.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Session Analytics</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Anonymous daily site traffic, route interactions, page hit frequencies, and device specifications.
                </p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Authentication Credentials</span>
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Encrypted passwords and administrative tokens for staff security layers.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div id="data-usage" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">3</span>
              <span>How We Use Your Information</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We process personal credentials purely for legitimate educational and technical objectives:
            </p>
            <ul className="space-y-3 pl-2">
              {[
                'To reply to direct questions, inquiries, and complaints submitted to the Administration.',
                'To review, approve, and display selected Alumni legacy stories on the community panel.',
                'To secure portal systems against unauthorized logins, malicious inputs, or cyber attacks.',
                'To optimize website visual performance, speeds, and information architecture by interpreting analytic telemetry logs.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4 */}
          <div id="data-security" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">4</span>
              <span>Data Protection & Security</span>
            </h2>
            <p className="text-slate-600 leading-relaxed flex items-start gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
              <Lock className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
              <span>
                We deploy robust hardware and software security barriers. Your contact information is secured utilizing modern encryption algorithms, and direct DB write procedures pass stringent sanitization policies to deny code injection risks.
              </span>
            </p>
          </div>

          {/* Section 5 */}
          <div id="cookies" className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">5</span>
              <span>Contact Administration</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              If you have any questions about this Privacy Policy, your cached entries, or wish to request data deletion, please contact our ICT office.
            </p>
            <div className="p-6 bg-slate-5 w-full rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-bold text-slate-800">ES GISHOMA Registry Office</p>
                <p className="text-sm text-slate-500">123 Academic Way, Education District</p>
              </div>
              <a 
                href="/contact" 
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Inquire Now
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
