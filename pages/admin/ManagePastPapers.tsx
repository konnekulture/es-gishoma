
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, FileText, Upload, AlertTriangle, Loader2, Tag, Calendar, Layers, ChevronRight, Settings } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { PastPaper, ALevelSection } from '../../types';

export default function ManagePastPapers() {
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [alevelSections, setAlevelSections] = useState<ALevelSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingPaper, setEditingPaper] = useState<PastPaper | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [division, setDivision] = useState<'O-Level' | 'A-Level'>('O-Level');
  const [section, setSection] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  // Section Management State
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [papersData, sectionsData] = await Promise.all([
        MockDB.getPastPapers(),
        MockDB.getALevelSections()
      ]);
      setPapers(papersData);
      setAlevelSections(sectionsData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSubject('');
    setYear(new Date().getFullYear());
    setDivision('O-Level');
    setSection('');
    setFileName('');
    setFileUrl('');
    setEditingPaper(null);
  };

  const handleOpenModal = (paper?: PastPaper) => {
    if (paper) {
      setEditingPaper(paper);
      setTitle(paper.title);
      setSubject(paper.subject);
      setYear(paper.year);
      setDivision(paper.division);
      setSection(paper.section || '');
      setFileName(paper.fileName);
      setFileUrl(paper.fileUrl);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !subject.trim() || (division === 'A-Level' && !section)) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!fileUrl) {
      alert("Please select a PDF file to upload.");
      return;
    }

    setIsProcessing(true);
    try {
      const newPaper: PastPaper = {
        id: editingPaper ? editingPaper.id : `pp${Date.now()}`,
        title: title.trim(),
        subject: subject.trim(),
        year,
        division,
        section: division === 'A-Level' ? section : undefined,
        fileName,
        fileUrl
      };
      
      await MockDB.savePastPaper(newPaper);
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
      await MockDB.deletePastPaper(deletingId);
      await loadData();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    setIsProcessing(true);
    try {
      await MockDB.saveALevelSection({
        id: `sec${Date.now()}`,
        name: newSectionName.trim().toUpperCase()
      });
      setNewSectionName('');
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    setIsProcessing(true);
    try {
      await MockDB.deleteALevelSection(id);
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.division.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.section && p.section.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Past Papers</h1>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Manage examination archives and past papers.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsSectionModalOpen(true)}
            className="bg-white text-slate-700 px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-50 transition-all border border-slate-200"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm sm:text-base">Manage Sections</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm sm:text-base">Add Past Paper</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by title or subject..." 
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
          ) : filteredPapers.length > 0 ? (
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Paper</th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject / Year</th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Division / Section</th>
                  <th className="px-6 sm:px-8 py-4 sm:py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPapers.map((paper) => (
                  <tr key={paper.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate max-w-[200px]">{paper.title}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-[200px]">{paper.fileName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{paper.subject}</span>
                        <span className="text-xs text-slate-400">{paper.year}</span>
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex flex-col gap-1">
                        <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100 whitespace-nowrap w-fit">
                          {paper.division}
                        </span>
                        {paper.section && (
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 whitespace-nowrap w-fit">
                            {paper.section}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleOpenModal(paper)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" aria-label="Edit">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => confirmDelete(paper.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" aria-label="Delete">
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
               <FileText className="w-12 h-12 mb-4 opacity-20" />
               <p className="font-bold">No past papers found.</p>
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
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Delete Past Paper?</h3>
              <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">This document will be removed from the public archives. This action cannot be undone.</p>
              
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
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Delete Paper</span>}
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{editingPaper ? 'Edit' : 'Add'} Past Paper</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 sm:p-10 overflow-y-auto custom-scrollbar space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <Tag className="w-3 h-3 mr-2 text-indigo-500" /> Title
                </label>
                <input 
                  required
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                  placeholder="e.g. Mathematics P1 National Exam"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject</label>
                  <input 
                    required
                    type="text" 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-2 text-indigo-500" /> Year
                  </label>
                  <input 
                    required
                    type="number" 
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Division</label>
                  <select 
                    required
                    value={division}
                    onChange={(e) => {
                      setDivision(e.target.value as 'O-Level' | 'A-Level');
                      if (e.target.value === 'O-Level') setSection('');
                    }}
                    className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                  >
                    <option value="O-Level">O-Level</option>
                    <option value="A-Level">A-Level</option>
                  </select>
                </div>
                {division === 'A-Level' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Section</label>
                    <select 
                      required
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full px-5 py-3 sm:px-6 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all text-sm sm:text-base"
                    >
                      <option value="">Select Section</option>
                      {alevelSections.map(sec => (
                        <option key={sec.id} value={sec.name}>{sec.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center">
                  <Upload className="w-3 h-3 mr-2 text-indigo-500" /> PDF Document
                </label>
                <div className="w-full p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative group min-h-[140px]">
                  <FileText className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 transition-colors ${fileUrl ? 'text-indigo-600' : 'text-slate-300'}`} />
                  <p className="text-xs sm:text-sm font-bold text-slate-700 text-center px-4 line-clamp-2">{fileName || 'Click to select PDF paper'}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Accepts .pdf files only</p>
                  <input 
                    type="file" 
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
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
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingPaper ? 'Update Paper' : 'Add to Archives')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Section Management Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900">A-Level Sections</h2>
              <button onClick={() => setIsSectionModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="New section (e.g. PCB)"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-50 font-medium text-sm"
                />
                <button 
                  onClick={handleAddSection}
                  disabled={isProcessing || !newSectionName.trim()}
                  className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {alevelSections.map(sec => (
                  <div key={sec.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">{sec.name}</span>
                    <button 
                      onClick={() => handleDeleteSection(sec.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {alevelSections.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-4">No sections defined.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
