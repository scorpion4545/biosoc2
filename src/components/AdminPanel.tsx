import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Link as LinkIcon, Mail, Save, Plus, Trash2, Edit2 } from 'lucide-react';

interface CouncilMember {
  id: string;
  name: string;
  position: string;
  image: string;
  department?: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'responded';
}

type AdminTab = 'council' | 'recruitment' | 'enquiries';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('council');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // Council Members State
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([
    { id: '1', name: 'John Doe', position: 'President', image: '/team/1.jpg', department: 'Core' },
    { id: '2', name: 'Jane Smith', position: 'Vice President', image: '/team/2a.jpg', department: 'Core' },
  ]);
  const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<CouncilMember>>({
    name: '',
    position: '',
    image: '',
    department: 'Core'
  });

  // Recruitment Link State
  const [recruitmentLink, setRecruitmentLink] = useState('https://forms.gle/your-recruitment-form');
  const [tempRecruitmentLink, setTempRecruitmentLink] = useState(recruitmentLink);

  // Enquiries State
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      message: 'I would like to know more about upcoming events.',
      date: '2024-01-15',
      status: 'new'
    },
    {
      id: '2',
      name: 'Bob Williams',
      email: 'bob@example.com',
      message: 'How can I join BioSoc-DTU?',
      date: '2024-01-14',
      status: 'read'
    },
  ]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication - in production, use proper auth
    if (password === 'biosoc2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  // Council Management Functions
  const handleAddMember = () => {
    if (newMember.name && newMember.position && newMember.image) {
      const member: CouncilMember = {
        id: Date.now().toString(),
        name: newMember.name,
        position: newMember.position,
        image: newMember.image,
        department: newMember.department || 'Core'
      };
      setCouncilMembers([...councilMembers, member]);
      setNewMember({ name: '', position: '', image: '', department: 'Core' });
    }
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      setCouncilMembers(councilMembers.filter(m => m.id !== id));
    }
  };

  const handleUpdateMember = () => {
    if (editingMember) {
      setCouncilMembers(councilMembers.map(m => 
        m.id === editingMember.id ? editingMember : m
      ));
      setEditingMember(null);
    }
  };

  // Recruitment Link Functions
  const handleSaveRecruitmentLink = () => {
    setRecruitmentLink(tempRecruitmentLink);
    alert('Recruitment link updated successfully!');
  };

  // Enquiry Functions
  const handleMarkAsRead = (id: string) => {
    setEnquiries(enquiries.map(e => 
      e.id === id ? { ...e, status: 'read' as const } : e
    ));
  };

  const handleMarkAsResponded = (id: string) => {
    setEnquiries(enquiries.map(e => 
      e.id === id ? { ...e, status: 'responded' as const } : e
    ));
  };

  const handleDeleteEnquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      setEnquiries(enquiries.filter(e => e.id !== id));
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
          <p className="mt-4 text-center text-xs text-slate-500">
            Demo password: biosoc2025
          </p>
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
            onClick={() => setIsAuthenticated(false)}
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
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    value={newMember.position}
                    onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <input
                    type="text"
                    placeholder="Image Path (e.g., /team/photo.jpg)"
                    value={newMember.image}
                    onChange={(e) => setNewMember({ ...newMember, image: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  />
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                    className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Core">Core</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Technical">Technical</option>
                    <option value="Content">Content</option>
                  </select>
                </div>
                <button
                  onClick={handleAddMember}
                  className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold text-white transition-all hover:shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  Add Member
                </button>
              </div>

              {/* Edit Member Modal */}
              {editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                  <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-white">Edit Member</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Name"
                        value={editingMember.name}
                        onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Position"
                        value={editingMember.position}
                        onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Image Path"
                        value={editingMember.image}
                        onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                        className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleUpdateMember}
                          className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMember(null)}
                          className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Members List */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {councilMembers.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-xl border border-slate-700 bg-slate-800 p-4"
                  >
                    <img
                      src={member.image}
                      alt={member.name}
                      className="mb-3 h-32 w-full rounded-lg object-cover"
                    />
                    <h4 className="font-semibold text-white">{member.name}</h4>
                    <p className="text-sm text-cyan-400">{member.position}</p>
                    <p className="text-xs text-slate-500">{member.department}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
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
                      key={enquiry.id}
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
                          <p className="mt-1 text-xs text-slate-500">{enquiry.date}</p>
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
                            onClick={() => handleMarkAsRead(enquiry.id)}
                            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
                          >
                            Mark as Read
                          </button>
                        )}
                        {enquiry.status !== 'responded' && (
                          <button
                            onClick={() => handleMarkAsResponded(enquiry.id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Mark as Responded
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry.id)}
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
    </div>
  );
};

export default AdminPanel;
