
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Check, Calendar, Tag, Image as ImageIcon, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { Announcement } from '../../types';

export default function ManageAnnouncements() {
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('News');
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAnns(MockDB.getAnnouncements());
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('News');
    setImage('');
    setIsFeatured(false);
    setEditingAnn(null);
  };

  const handleOpenModal = (ann?: Announcement) => {
    if (ann) {
      setEditingAnn(ann);
      setTitle(ann.title);
      setContent(ann.content);
      setCategory(ann.category);
      setImage(ann.image);
      setIsFeatured(ann.isFeatured || false);
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
    setIsProcessing(true);
    try {
      const newAnn: Announcement = {
        id: editingAnn ? editingAnn.id : Date.now().toString(),
        title,
        content,
        category,
        image,
        isFeatured,
        date: editingAnn ? editingAnn.date : new Date().toISOString().split('T')[0]
      };
      await MockDB.saveAnnouncement(newAnn);
      loadData();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save');
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
      await MockDB.deleteAnnouncement(deletingId);
      loadData();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Unauthorized deletion');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredAnns = anns.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Announcements</h1>
          <p className="text-slate-500 font-medium">Create, edit, and broadcast news to the public.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Preview</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Announcement Details</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAnns.map((ann) => (
                <tr key={ann.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    {ann.image ? (
                      <img src={ann.image} className="w-20 h-14 rounded-lg object-cover shadow-sm" alt="" />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-900 mb-1">{ann.title}</div>
                    <div className="flex items-center text-xs text-slate-400 space-x-2 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>{ann.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                      {ann.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {ann.isFeatured ? (
                      <span className="flex items-center text-emerald-500 text-xs font-bold space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Featured</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">Standard</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleOpenModal(ann)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => confirmDelete(ann.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Content?</h3>
              <p className="text-slate-500 font-medium">This action cannot be undone. This announcement will be removed from the public portal immediately.</p>
              
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Delete Now</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">{editingAnn ? 'Edit' : 'Create'} Announcement</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <Tag className="w-3 h-3 mr-2 text-indigo-500" /> Title
                </label>
                <input 
                  required
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  placeholder="e.g. Science Fair 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium appearance-none"
                  >
                    <option>News</option>
                    <option>Academic</option>
                    <option>Urgent</option>
                    <option>Event</option>
                  </select>
                </div>
                <div className="flex items-end pb-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-6"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Feature on Home Page</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <ImageIcon className="w-3 h-3 mr-2 text-indigo-500" /> Cover Image
                </label>
                <div className="flex items-center space-x-6">
                  <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group">
                    {image ? (
                      <>
                        <img src={image} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </>
                    ) : (
                      <Upload className="w-8 h-8 text-slate-300" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-slate-700">Click to upload from device</p>
                    <p className="text-xs text-slate-400">PNG, JPG or WebP. Max 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Content Body</label>
                <textarea 
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  placeholder="Write the full story here..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Discard
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingAnn ? 'Update' : 'Publish') + ' Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
