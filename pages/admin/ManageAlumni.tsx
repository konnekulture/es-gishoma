
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, GraduationCap, AlertTriangle, Loader2, Tag, Image as ImageIcon, Quote } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { AlumniStory } from '../../types';

export default function ManageAlumni() {
  const [stories, setStories] = useState<AlumniStory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<AlumniStory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [classYear, setClassYear] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await MockDB.getAlumniStories();
      setStories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setClassYear('');
    setRole('');
    setQuote('');
    setImage('');
    setEditingStory(null);
  };

  const handleOpenModal = (story?: AlumniStory) => {
    if (story) {
      setEditingStory(story);
      setName(story.name);
      setClassYear(story.classYear);
      setRole(story.role);
      setQuote(story.quote);
      setImage(story.image);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !classYear.trim() || !role.trim() || !quote.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsProcessing(true);
    try {
      const newStory: AlumniStory = {
        id: editingStory ? editingStory.id : `as${Date.now()}`,
        name: name.trim(),
        classYear: classYear.trim(),
        role: role.trim(),
        quote: quote.trim(),
        image: image.trim() || `https://picsum.photos/seed/${Date.now()}/400/400`
      };
      
      await MockDB.saveAlumniStory(newStory);
      await loadData();
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Save operation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsProcessing(true);
    try {
      await MockDB.deleteAlumniStory(deletingId);
      await loadData();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredStories = stories.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Alumni Stories</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Manage success stories and testimonials from our graduates.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm sm:text-base">Add Alumni Story</span>
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-50 font-medium text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          {isLoading ? (
            <div className="p-20 text-center text-slate-400 flex flex-col items-center">
               <Loader2 className="w-12 h-12 mb-4 animate-spin text-indigo-600" />
               <p className="font-bold text-[10px] uppercase tracking-widest">Querying Secure Database...</p>
            </div>
          ) : filteredStories.length > 0 ? (
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Alumnus</th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Class / Role</th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Quote</th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={story.image} 
                          alt={story.name} 
                          className="w-10 h-10 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="font-bold text-slate-900">{story.name}</div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{story.classYear}</span>
                        <span className="text-xs text-slate-400">{story.role}</span>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="text-xs text-slate-500 line-clamp-2 max-w-[300px] italic">"{story.quote}"</div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleOpenModal(story)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" aria-label="Edit">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => confirmDelete(story.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" aria-label="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 sm:p-24 text-center text-slate-400 flex flex-col items-center">
               <GraduationCap className="w-12 h-12 mb-4 opacity-20" />
               <p className="font-bold">No alumni stories found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Delete Story?</h3>
              <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">This story will be removed from the public alumni page.</p>
              
              <div className="flex gap-3 sm:gap-4 mt-8 sm:mt-10">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 sm:py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 sm:py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Delete Story</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 sm:p-10 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{editingStory ? 'Edit' : 'Add'} Alumni Story</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 sm:p-10 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                    <Tag className="w-3 h-3 mr-2 text-indigo-500" /> Full Name
                  </label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                    placeholder="e.g. Jean Bosco"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Class Year</label>
                  <input 
                    required
                    type="text" 
                    value={classYear}
                    onChange={(e) => setClassYear(e.target.value)}
                    className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                    placeholder="e.g. Class of 1998"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Role / Profession</label>
                <input 
                  required
                  type="text" 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                  placeholder="e.g. Chief Medical Officer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <ImageIcon className="w-3 h-3 mr-2 text-indigo-500" /> Alumnus Photo
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                    {image ? (
                      <img src={image} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-slate-700">Click to upload photo</p>
                    <p className="text-xs text-slate-400">Select a local image from your device.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <Quote className="w-3 h-3 mr-2 text-indigo-500" /> Testimonial Quote
                </label>
                <textarea 
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base resize-none"
                  placeholder="Share the alumnus's experience..."
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 shrink-0 pb-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 sm:order-1 flex-1 py-3.5 sm:py-4 bg-slate-100 text-slate-600 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-200 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="order-1 sm:order-2 flex-[2] py-3.5 sm:py-4 bg-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center text-sm sm:text-base"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingStory ? 'Update Story' : 'Add Story')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
