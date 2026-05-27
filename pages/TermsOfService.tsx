import React, { useEffect } from 'react';
import { FileText, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <div className="bg-slate-900 py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="absolute h-96 w-96 -top-48 -left-48 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute h-96 w-96 -bottom-48 -right-48 bg-violet-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex p-3 bg-indigo-505/10 text-indigo-400 rounded-2xl mb-6 border border-indigo-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Please read these terms and conditions carefully before accessing or using the ES GISHOMA portal systems.
          </p>
          <div className="mt-6 text-slate-400 text-xs font-medium uppercase tracking-wider">
            Last Updated: May 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 mt-16 sm:mt-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">1</span>
              <span>Acceptance of Terms</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing the ES GISHOMA website, student networks, message panels, or system services, you agree to comply with and be bound by these Terms of Service and all applicable educational laws.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">2</span>
              <span>Acceptable Web Use</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You agree not to use the services for:
            </p>
            <ul className="space-y-3 pl-2">
              {[
                'Posting or transmitting defamatory, offensive, or harassing inquiries to the administrators.',
                'Submitting fabricated alumni stories, legacy data, or credentials which you do not legally own.',
                'Automated crawling, scraping, database flooding, or script injections targeted at database modules.',
                'Any activities that disrupt the overall bandwidth, performance, or availability of the digital servers.'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-600 text-sm">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">3</span>
              <span>Intellectual Property Rights</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              All text, curricula material, past examination sheets, campus photo assets, logo designs, and technical codes on this portal are the intellectual property of ES GISHOMA or licensed to us. You may view and print curriculum info or download past paper assets strictly for non-commercial individual learning.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">4</span>
              <span>External Educational Resources</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Our site may incorporate links to official government educational departments or outside curriculum authorities. We do not assume responsibility for the uptime or content accuracy of external web resources.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm">5</span>
              <span>Disclaimer of Warranties</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              These databases and material are distributed on an "as-is" pattern. While we maintain a premium experience, ES GISHOMA does not guarantee error-free server continuity or uninterrupted academic downloads without technical delays.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
