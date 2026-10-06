import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Link as LinkIcon, Mail, Save, Plus, Trash2, Edit2, Upload, X, Loader, Search } from 'lucide-react';
import axios from 'axios';
import { DEFAULT_RECRUITMENT_URL, normalizeRecruitmentUrl } from '../lib/recruitment';

const API_URL = 'http://localhost:3001/api';
const ADMIN_PASSWORD = 'admin123'; // Should match server/.env

interface CouncilMember {
  _id: string;
  name: string;
  position: string;
  imageUrl: string;
  councilType: 'Senior' | 'Junior';
  department: string;
  email?: string;
  linkedin?: string;
  order: number;
}

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'responded';
}

type AdminTab = 'council' | 'recruitment' | 'enquiries';

const AdminPanelV2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('council');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Council Members State
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    position: '',
    councilType: 'Senior' as 'Senior' | 'Junior',
    department: 'Core',
    email: '',
    linkedin: '',
    order: 0
  });

  // Recruitment Link State
  const [recruitmentLink, setRecruitmentLink] = useState('');
  const [tempRecruitmentLink, setTempRecruitmentLink] = useState('');

  // Enquiries State
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);

  const filteredCouncilMembers = councilMembers.filter((member) =>
    [member.name, member.position, member.councilType, member.department, member.email]
      .some((value) => value?.toLowerCase().includes(memberSearch.trim().toLowerCase()))
  );

  // Fetch data on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCouncilMembers();
      fetchEnquiries();
      fetchRecruitmentLink();
    }
  }, [isAuthenticated]);

  const apiConfig = {
    headers: {
      'x-admin-password': ADMIN_PASSWORD
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Incorrect password!');
    }
  };

  // Council Members Functions
  const fetchCouncilMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/council-members`);
      setCouncilMembers(response.data.data);
    } catch (error) {
      console.error('Error fetching council members:', error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.position || !selectedImage) {
      alert('Please fill all required fields and select an image');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('name', newMember.name);
      formData.append('position', newMember.position);
      formData.append('councilType', newMember.councilType);
      formData.append('department', newMember.department);
      formData.append('email', newMember.email);
      formData.append('linkedin', newMember.linkedin);
      formData.append('order', newMember.order.toString());

      await axios.post(`${API_URL}/council-members`, formData, apiConfig);
      
      alert('Member added successfully!');
      setNewMember({ name: '', position: '', councilType: 'Senior', department: 'Core', email: '', linkedin: '', order: 0 });
      setSelectedImage(null);
      setImagePreview('');
      fetchCouncilMembers();
    } catch (error: any) {
      alert('Error adding member: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    setUploading(true);
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      formData.append('name', editingMember.name);
      formData.append('position', editingMember.position);
      formData.append('councilType', editingMember.councilType);
      formData.append('department', editingMember.department);
      formData.append('email', editingMember.email || '');
      formData.append('linkedin', editingMember.linkedin || '');
      formData.append('order', editingMember.order.toString());

      await axios.put(`${API_URL}/council-members/${editingMember._id}`, formData, apiConfig);
      
      alert('Member updated successfully!');
      setEditingMember(null);
      setSelectedImage(null);
      setImagePreview('');
      fetchCouncilMembers();
    } catch (error: any) {
      alert('Error updating member: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      await axios.delete(`${API_URL}/council-members/${id}`, apiConfig);
      alert('Member deleted successfully!');
      fetchCouncilMembers();
    } catch (error: any) {
      alert('Error deleting member: ' + (error.response?.data?.message || error.message));
    }
  };

  // Recruitment Link Functions
  const fetchRecruitmentLink = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings/recruitment-link`);
      const savedUrl = normalizeRecruitmentUrl(String(response.data?.data?.value || ''));
      const value = savedUrl || DEFAULT_RECRUITMENT_URL;
      setRecruitmentLink(value);
      setTempRecruitmentLink(value);
    } catch (error) {
      setRecruitmentLink(DEFAULT_RECRUITMENT_URL);
      setTempRecruitmentLink(DEFAULT_RECRUITMENT_URL);
    }
  };

  const handleSaveRecruitmentLink = async () => {
    const normalizedUrl = normalizeRecruitmentUrl(tempRecruitmentLink);
    if (!normalizedUrl) {
      alert('Enter a valid web URL.');
      return;
    }

    try {
      await axios.put(`${API_URL}/settings/recruitment-link`, {
        value: normalizedUrl,
        description: 'Active recruitment form link'
      }, apiConfig);
      
      setRecruitmentLink(normalizedUrl);
      setTempRecruitmentLink(normalizedUrl);
      alert('Recruitment link updated successfully!');
    } catch (error: any) {
      alert('Error updating link: ' + (error.response?.data?.message || error.message));
    }
  };

  // Enquiry Functions
  const fetchEnquiries = async () => {
    try {
      const response = await axios.get(`${API_URL}/enquiries`, apiConfig);
      setEnquiries(response.data.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.put(`${API_URL}/enquiries/${id}`, { status: 'read' }, apiConfig);
      fetchEnquiries();
    } catch (error: any) {
      alert('Error updating enquiry: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleMarkAsResponded = async (id: string) => {
    try {
      await axios.put(`${API_URL}/enquiries/${id}`, { status: 'responded' }, apiConfig);
      fetchEnquiries();
    } catch (error: any) {
      alert('Error updating enquiry: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      await axios.delete(`${API_URL}/enquiries/${id}`, apiConfig);
      fetchEnquiries();
    } catch (error: any) {
      alert('Error deleting enquiry: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1121] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        >
          <h1 className="mb-6 text-center text-3xl font-bold text-white">
            Admin Panel
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1121] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              localStorage.removeItem('adminAuth');
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('council')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === 'council'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="h-5 w-5" />
            Council Members
          </button>
          <button
            onClick={() => setActiveTab('recruitment')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === 'recruitment'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <LinkIcon className="h-5 w-5" />
            Recruitment Link
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all ${
              activeTab === 'enquiries'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Mail className="h-5 w-5" />
            Enquiries
            {enquiries.filter(e => e.status === 'new').length > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {enquiries.filter(e => e.status === 'new').length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          {/* Council Members Tab */}
          {activeTab === 'council' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Manage Council Members</h2>
              
              {/* Add New Member Form */}
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Add New Member</h3>
                
                {/* Image Upload */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Profile Image *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 px-6 py-4 transition-colors hover:border-cyan-500 hover:bg-slate-600">
                      <Upload className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-slate-300">Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <button
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview('');
                          }}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Max size: 5MB | Formats: JPG, PNG, WEBP</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Position *"
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <select
                    value={newMember.councilType}
                    onChange={(e) => setNewMember({ ...newMember, councilType: e.target.value as 'Senior' | 'Junior' })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Senior">Senior Council</option>
                    <option value="Junior">Junior Council</option>
                  </select>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Core">Core</option>
                    <option value="Events">Events</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technical">Technical</option>
                    <option value="Content">Content</option>
                    <option value="Design">Design</option>
                    <option value="Operations">Operations</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn URL (optional)"
                    value={newMember.linkedin}
                    onChange={(e) => setNewMember({ ...newMember, linkedin: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <input
                    type="number"
                    placeholder="Display Order"
                    value={newMember.order}
                    onChange={(e) => setNewMember({ ...newMember, order: parseInt(e.target.value) || 0 })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  onClick={handleAddMember}
                  disabled={uploading}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Add Member
                    </>
                  )}
                </button>
              </div>

              {/* Edit Member Modal */}
              {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                  <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-800 p-6 max-h-[90vh] overflow-y-auto">
                    <h3 className="mb-4 text-lg font-semibold text-white">Edit Member</h3>
                    
                    {/* Image Upload for Edit */}
                    <div className="mb-4">
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Profile Image
                      </label>
                      <div className="flex items-center gap-4">
                        <img
                          src={imagePreview || editingMember.imageUrl}
                          alt={editingMember.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 px-6 py-4 transition-colors hover:border-cyan-500">
                          <Upload className="h-5 w-5 text-cyan-400" />
                          <span className="text-sm text-slate-300">Change Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Name"
                        value={editingMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={editingMember.position}
                        onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <select
                        value={editingMember.councilType}
                        onChange={(e) => setEditingMember({ ...editingMember, councilType: e.target.value as 'Senior' | 'Junior' })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      >
                        <option value="Senior">Senior Council</option>
                        <option value="Junior">Junior Council</option>
                      </select>
                      <select
                        value={editingMember.department}
                        onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      >
                        <option value="Core">Core</option>
                        <option value="Events">Events</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Technical">Technical</option>
                        <option value="Content">Content</option>
                        <option value="Design">Design</option>
                        <option value="Operations">Operations</option>
                      </select>
                      <input
                        type="email"
                        placeholder="Email"
                        value={editingMember.email || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="url"
                        placeholder="LinkedIn URL"
                        value={editingMember.linkedin || ''}
                        onChange={(e) => setEditingMember({ ...editingMember, linkedin: e.target.value })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="number"
                        placeholder="Display Order"
                        value={editingMember.order}
                        onChange={(e) => setEditingMember({ ...editingMember, order: parseInt(e.target.value) || 0 })}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={handleUpdateMember}
                        disabled={uploading}
                        className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                      >
                        {uploading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingMember(null);
                          setSelectedImage(null);
                          setImagePreview('');
                        }}
                        className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Members List */}
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Current Members ({filteredCouncilMembers.length}{memberSearch.trim() ? ` of ${councilMembers.length}` : ''})
                  </h3>
                  <div className="relative w-full sm:max-w-sm">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={memberSearch}
                      onChange={(event) => setMemberSearch(event.target.value)}
                      placeholder="Search name, role, department..."
                      aria-label="Search council members"
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pl-10 pr-10 text-white outline-none placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                    {memberSearch && (
                      <button
                        type="button"
                        onClick={() => setMemberSearch('')}
                        aria-label="Clear council member search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                {filteredCouncilMembers.length ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCouncilMembers.map((member) => (
                    <div
                      key={member._id}
                      className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                    >
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="mb-3 h-32 w-full rounded-lg object-cover"
                      />
                      <h4 className="font-semibold text-white">{member.name}</h4>
                      <p className="text-sm text-cyan-400">{member.position}</p>
                      <p className="text-xs text-slate-500">{member.department}</p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingMember(member);
                            setImagePreview('');
                            setSelectedImage(null);
                          }}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-400">
                    {memberSearch.trim() ? 'No council members match your search.' : 'No council members yet.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recruitment Link Tab */}
          {activeTab === 'recruitment' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Recruitment Form Link</h2>
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Current Recruitment Form URL
                </label>
                <input
                  type="url"
                  value={tempRecruitmentLink}
                  onChange={(e) => setTempRecruitmentLink(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="https://forms.gle/your-form-link"
                />
                <button
                  onClick={handleSaveRecruitmentLink}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
                >
                  <Save className="h-5 w-5" />
                  Save Link
                </button>
                <div className="mt-6 rounded-lg bg-slate-700/50 p-4">
                  <p className="text-sm text-slate-400">
                    <strong className="text-white">Current Active Link:</strong>
                    <br />
                    <a
                      href={recruitmentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline"
                    >
                      {recruitmentLink}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Contact Enquiries</h2>
              <div className="space-y-4">
                {enquiries.length === 0 ? (
                  <p className="text-center text-slate-400">No enquiries yet.</p>
                ) : (
                  enquiries.map((enquiry) => (
                    <div
                      key={enquiry._id}
                      className={`rounded-xl border p-6 ${
                        enquiry.status === 'new'
                          ? 'border-cyan-500/50 bg-cyan-500/5'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {enquiry.name}
                          </h3>
                          <p className="text-sm text-slate-400">{enquiry.email}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(enquiry.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            enquiry.status === 'new'
                              ? 'bg-cyan-500 text-white'
                              : enquiry.status === 'read'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {enquiry.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="mb-4 text-slate-300">{enquiry.message}</p>
                      <div className="flex flex-wrap gap-2">
                        {enquiry.status === 'new' && (
                          <button
                            onClick={() => handleMarkAsRead(enquiry._id)}
                            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
                          >
                            Mark as Read
                          </button>
                        )}
                        {enquiry.status !== 'responded' && (
                          <button
                            onClick={() => handleMarkAsResponded(enquiry._id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Mark as Responded
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry._id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="mx-auto mt-8 max-w-7xl border-t border-slate-800 pt-4 text-center text-sm text-slate-500">
        Created by{' '}
        <a
          href="https://www.linkedin.com/in/krishna-joshi-dtu/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
        >
          Krishna Joshi
        </a>
      </footer>
    </div>
  );
};

export default AdminPanelV2;
