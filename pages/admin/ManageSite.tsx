import React, { useState, useEffect } from 'react';
import { Save, Upload, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { MockDB } from '../../services/mockDb';

export default function ManageSite() {
  const [homeConfig, setHomeConfig] = useState<any>({
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    schoolBrief: '',
    schoolBriefImage: ''
  });
  const [aboutConfig, setAboutConfig] = useState<any>({
    aboutHeroImage: '',
    aboutLegacyImage1: '',
    aboutLegacyImage2: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [home, about] = await Promise.all([
        MockDB.getHomeConfig(),
        MockDB.getAboutConfig()
      ]);
      setHomeConfig(home);
      setAboutConfig(about);
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await MockDB.saveHomeConfig(homeConfig);
      setMessage({ type: 'success', text: 'Home settings saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save home settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleAboutSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await MockDB.saveAboutImages(aboutConfig);
      setMessage({ type: 'success', text: 'About page images updated successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update images' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string, target: 'home' | 'about') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (target === 'home') {
          setHomeConfig({ ...homeConfig, [field]: base64 });
        } else {
          setAboutConfig({ ...aboutConfig, [field]: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Management</h1>
          <p className="text-slate-500">Control the visual identity and primary content of your website.</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Home Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Home Page Hero</h2>
          <p className="text-sm text-slate-500">Update the main banner sections of your home page.</p>
        </div>
        <form onSubmit={handleHomeSave} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Hero Title</label>
              <input 
                type="text" 
                value={homeConfig.heroTitle}
                onChange={(e) => setHomeConfig({ ...homeConfig, heroTitle: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Main Headline"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Hero Subtitle</label>
              <textarea 
                value={homeConfig.heroSubtitle}
                onChange={(e) => setHomeConfig({ ...homeConfig, heroSubtitle: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24"
                placeholder="Brief description below headline"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">Hero Background Image</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-64 h-40 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center group relative">
                {homeConfig.heroImage ? (
                  <img src={homeConfig.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                )}
                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                  <div className="flex flex-col items-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Change Image</span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'heroImage', 'home')}
                  />
                </label>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-500 leading-relaxed">
                  Recommended size: <span className="font-semibold">1920x1080px</span>. 
                  This image appears as the main background for your school's landing page.
                </p>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('home-upload-btn')?.click()}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Select File
                  </button>
                  <input id="home-upload-btn" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage', 'home')} />
                </div>
              </div>
            </div>
          </div>

          {/* School Brief Image */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <label className="text-sm font-semibold text-slate-700">School Brief Image (Secondary Section)</label>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-full sm:w-64 h-40 bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                {homeConfig.schoolBriefImage ? (
                  <img src={homeConfig.schoolBriefImage} alt="Brief Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-500 leading-relaxed">
                  This image appears next to the school's "Investing In Our Student's Future" summary on the home page.
                </p>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => document.getElementById('brief-upload-btn')?.click()}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Select Brief Image
                  </button>
                  <input id="brief-upload-btn" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'schoolBriefImage', 'home')} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Home Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* About Page Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">About Page Images</h2>
          <p className="text-sm text-slate-500">Update the visuals on your About Us page.</p>
        </div>
        <form onSubmit={handleAboutSave} className="p-6 space-y-8">
          {/* About Hero */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-700">About Page Hero (Top Image)</label>
            <div className="flex items-center gap-6">
              <div className="w-48 h-32 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img src={aboutConfig.aboutHeroImage} className="w-full h-full object-cover" alt="About Hero" />
              </div>
              <div className="flex flex-col gap-2">
                <input 
                  type="file" 
                  className="hidden" 
                  id="about-hero-up" 
                  onChange={(e) => handleImageUpload(e, 'aboutHeroImage', 'about')} 
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('about-hero-up')?.click()}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Upload New Image
                </button>
              </div>
            </div>
          </div>

          {/* Legacy Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Legacy Image 1 (Left)</label>
              <div className="space-y-4">
                <img src={aboutConfig.aboutLegacyImage1} className="w-full h-48 object-cover rounded-xl border border-slate-200" alt="Legacy 1" />
                <input 
                  type="file" 
                  className="hidden" 
                  id="legacy-1-up" 
                  onChange={(e) => handleImageUpload(e, 'aboutLegacyImage1', 'about')} 
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('legacy-1-up')?.click()}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Change Image 1
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700">Legacy Image 2 (Right)</label>
              <div className="space-y-4">
                <img src={aboutConfig.aboutLegacyImage2} className="w-full h-48 object-cover rounded-xl border border-slate-200" alt="Legacy 2" />
                <input 
                  type="file" 
                  className="hidden" 
                  id="legacy-2-up" 
                  onChange={(e) => handleImageUpload(e, 'aboutLegacyImage2', 'about')} 
                />
                <button 
                  type="button"
                  onClick={() => document.getElementById('legacy-2-up')?.click()}
                  className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Change Image 2
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Update About Images'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
