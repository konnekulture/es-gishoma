
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, X, Image as ImageIcon, Tag, Grid, List, Upload, AlertCircle, Loader2, Edit2, Check } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { GalleryItem } from '../../types';

export default function ManageGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Campus');
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setItems(MockDB.getGallery());
  };

  const resetForm = () => {
    setUrl('');
    setCaption('');
    setCategory('Campus');
    setIsFeatured(false);
    setEditingItem(null);
  };

  const handleOpenModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setUrl(item.url);
      setCaption(item.caption);
      setCategory(item.category);
      setIsFeatured(item.isFeatured || false);
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
        setUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const newItem: GalleryItem = {
        id: editingItem ? editingItem.id : `g${Date.now()}`,
        url,
        caption,
        category: category || 'General',
        isFeatured
      };
      await MockDB.saveGalleryItem(newItem);
      loadData();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action not permitted');
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
      await MockDB.deleteGalleryItem(deletingId);
      loadData();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : '403 Forbidden: Contact superadmin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = items.filter(i => 
    i.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Media Library</h1>
          <p className="text-slate-500 font-medium">Curate the visual story of your school.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <Plus className="w-5 h-5" />
          <span>Add Media</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[60vh]">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by caption or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-50 font-medium text-sm transition-all"
            />
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                  
                  {item.isFeatured && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white p-1.5 rounded-lg shadow-lg z-10">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col justify-between">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-white/20 hover:bg-white text-slate-900 rounded-lg transition-all backdrop-blur-md"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(item.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-white rounded-lg transition-all backdrop-blur-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-white">
                      <div className="text-xs font-bold line-clamp-1">{item.caption}</div>
                      <div className="text-[10px] uppercase font-black tracking-widest opacity-70">{item.category}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Thumbnail</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Caption</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Featured</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <img src={item.url} className="w-16 h-12 rounded-lg object-cover" alt="" />
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700 text-sm">{item.caption}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.isFeatured ? (
                          <span className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                            <Check className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                           <button onClick={() => handleOpenModal(item)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button onClick={() => confirmDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ImageIcon className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No media assets found</h3>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Media?</h3>
              <p className="text-slate-500 font-medium">Permanently remove this asset from the gallery? This cannot be undone.</p>
              
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
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Delete Media</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900">{editingItem ? 'Edit' : 'Add'} Media</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset File</label>
                <div className="w-full h-48 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                  {url ? (
                    <>
                      <img src={url} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <Upload className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Choose Image From Device</p>
                      <p className="text-xs text-slate-400">Drag & drop or click to browse</p>
                    </div>
                  )}
                  <input 
                    required={!url && !editingItem}
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Caption</label>
                <input 
                  required
                  type="text" 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  placeholder="Describe the image..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium appearance-none"
                  >
                    <option value="Campus">Campus</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Events">Events</option>
                    <option value="Sports">Sports</option>
                    <option value="Classroom">Classroom</option>
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
                    <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">Show on Home</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{editingItem ? 'Update Asset' : 'Upload Asset'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
