
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, UserPlus, Briefcase, Mail, Type, Upload, Camera, AlertTriangle, Loader2 } from 'lucide-react';
import { MockDB } from '../../services/mockDb';
import { Staff } from '../../types';

export default function ManageStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Staff | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStaff(MockDB.getStaff());
  };

  const resetForm = () => {
    setName('');
    setRole('');
    setBio('');
    setImage('');
    setDepartment('General');
    setEmail('');
    setEditingMember(null);
  };

  const handleOpenModal = (member?: Staff) => {
    if (member) {
      setEditingMember(member);
      setName(member.name);
      setRole(member.role);
      setBio(member.bio);
      setImage(member.image);
      setDepartment(member.department);
      setEmail(member.email);
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
      const newMember: Staff = {
        id: editingMember ? editingMember.id : `s${Date.now()}`,
        name,
        role,
        bio,
        image,
        department,
        email
      };
      await MockDB.saveStaff(newMember);
      loadData();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Permission denied');
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
      await MockDB.deleteStaff(deletingId);
      loadData();
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Access denied');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Staff Directory</h1>
          <p className="text-slate-500 font-medium">Manage faculty profiles and administrative staff.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <UserPlus className="w-5 h-5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-50 font-medium text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Profile</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Department</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      {member.image ? (
                        <img src={member.image} className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-white" alt="" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 ring-2 ring-white">
                          <Camera className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">{member.name}</div>
                        <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">{member.department}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button onClick={() => handleOpenModal(member)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => confirmDelete(member.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Remove Staff?</h3>
              <p className="text-slate-500 font-medium">Are you sure you want to remove this profile from the official faculty directory?</p>
              
              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Keep Profile
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 flex items-center justify-center space-x-2"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Remove Member</span>}
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
              <h2 className="text-3xl font-black text-slate-900">{editingMember ? 'Edit' : 'Add'} Staff Member</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-10 max-h-[70vh] overflow-y-auto space-y-8">
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                    {image ? (
                      <img src={image} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <Camera className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <label className="absolute bottom-1 right-1 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors">
                    <Upload className="w-5 h-5" />
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900">Upload Profile Picture</p>
                  <p className="text-xs text-slate-400 mt-1">Select a local photo from your device</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email</label>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Role / Position</label>
                  <input 
                    required
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Department</label>
                  <input 
                    required
                    type="text" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Short Bio</label>
                <textarea 
                  required
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                  placeholder="A brief description of background and passion for education..."
                ></textarea>
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
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingMember ? 'Update Profile' : 'Add to Faculty')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
