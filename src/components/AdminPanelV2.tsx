import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Link as LinkIcon, 
  Mail, 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  X, 
  Loader, 
  Search,
  Calendar
} from 'lucide-react';
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

interface EventImage {
  url: string;
  caption?: string;
  cloudinaryPublicId?: string;
}

interface Speaker {
  name: string;
  role: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
}

interface EventItem {
  _id: string;
  title: string;
  date: string;
  category: string;
  type: 'past' | 'upcoming';
  description: string;
  longDescription?: string;
  location?: string;
  attendees?: number;
  coverImage: string;
  cloudinaryPublicId?: string;
  images: EventImage[];
  highlights: string[];
  speakers: Speaker[];
  schedule: ScheduleItem[];
  order: number;
  isActive: boolean;
}

type AdminTab = 'council' | 'recruitment' | 'enquiries' | 'events';

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

  // Events Controller State
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventSearch, setEventSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<'all' | 'past' | 'upcoming'>('all');
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [uploadingEvent, setUploadingEvent] = useState(false);

  // New Event Form State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<{ file: File; previewUrl: string; caption: string }[]>([]);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'Conference',
    type: 'past' as 'past' | 'upcoming',
    description: '',
    longDescription: '',
    location: 'Delhi Technological University',
    attendees: 100,
    order: 0,
    highlights: ['Keynote presentations and interactive sessions'],
    speakers: [{ name: '', role: '' }],
    schedule: [{ time: '10:00 AM', activity: 'Registration & Keynote' }],
  });

  // Edit Event Modal State
  const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string>('');
  const [editNewGalleryFiles, setEditNewGalleryFiles] = useState<{ file: File; previewUrl: string; caption: string }[]>([]);

  const filteredCouncilMembers = councilMembers.filter((member) =>
    [member.name, member.position, member.councilType, member.department, member.email]
      .some((value) => value?.toLowerCase().includes(memberSearch.trim().toLowerCase()))
  );

  const filteredEvents = events.filter((ev) => {
    const matchesSearch = [ev.title, ev.category, ev.description, ev.location]
      .some((val) => val?.toLowerCase().includes(eventSearch.trim().toLowerCase()));
    const matchesType = eventTypeFilter === 'all' || ev.type === eventTypeFilter;
    return matchesSearch && matchesType;
  });

  // Fetch data on mount / authentication
  useEffect(() => {
    if (isAuthenticated) {
      fetchCouncilMembers();
      fetchEnquiries();
      fetchRecruitmentLink();
      fetchEvents();
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

  // ==========================================
  // EVENTS CONTROLLER FUNCTIONS & HANDLERS
  // ==========================================
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Cover image size must be under 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) {
          setEditCoverFile(file);
          setEditCoverPreview(reader.result as string);
        } else {
          setCoverFile(file);
          setCoverPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File ${file.name} is larger than 8MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const item = { file, previewUrl: reader.result as string, caption: '' };
        if (isEdit) {
          setEditNewGalleryFiles((prev) => [...prev, item]);
        } else {
          setGalleryFiles((prev) => [...prev, item]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.description || (!coverFile && !coverPreview)) {
      alert('Please fill all required fields (Title, Date, Description) and upload a Cover Image.');
      return;
    }

    setUploadingEvent(true);
    try {
      const formData = new FormData();
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }
      formData.append('title', newEvent.title);
      formData.append('date', newEvent.date);
      formData.append('category', newEvent.category);
      formData.append('type', newEvent.type);
      formData.append('description', newEvent.description);
      formData.append('longDescription', newEvent.longDescription);
      formData.append('location', newEvent.location);
      formData.append('attendees', newEvent.attendees.toString());
      formData.append('order', newEvent.order.toString());

      formData.append('highlights', JSON.stringify(newEvent.highlights.filter(h => h.trim())));
      formData.append('speakers', JSON.stringify(newEvent.speakers.filter(s => s.name.trim())));
      formData.append('schedule', JSON.stringify(newEvent.schedule.filter(s => s.activity.trim())));

      // Append gallery files and captions
      const captionsArr: string[] = [];
      galleryFiles.forEach((g) => {
        formData.append('galleryImages', g.file);
        captionsArr.push(g.caption || '');
      });
      formData.append('captions', JSON.stringify(captionsArr));

      await axios.post(`${API_URL}/events`, formData, apiConfig);

      alert('🎉 Event created & uploaded to Cloudinary successfully!');
      setNewEvent({
        title: '',
        date: '',
        category: 'Conference',
        type: 'past',
        description: '',
        longDescription: '',
        location: 'Delhi Technological University',
        attendees: 100,
        order: 0,
        highlights: ['Keynote presentations and interactive sessions'],
        speakers: [{ name: '', role: '' }],
        schedule: [{ time: '10:00 AM', activity: 'Registration' }],
      });
      setCoverFile(null);
      setCoverPreview('');
      setGalleryFiles([]);
      fetchEvents();
    } catch (error: any) {
      alert('Error creating event: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    setUploadingEvent(true);
    try {
      const formData = new FormData();
      if (editCoverFile) {
        formData.append('coverImage', editCoverFile);
      }
      formData.append('title', editingEvent.title);
      formData.append('date', editingEvent.date);
      formData.append('category', editingEvent.category);
      formData.append('type', editingEvent.type);
      formData.append('description', editingEvent.description);
      formData.append('longDescription', editingEvent.longDescription || '');
      formData.append('location', editingEvent.location || '');
      formData.append('attendees', (editingEvent.attendees || 0).toString());
      formData.append('order', (editingEvent.order || 0).toString());
      formData.append('isActive', editingEvent.isActive.toString());

      formData.append('highlights', JSON.stringify(editingEvent.highlights.filter(h => h.trim())));
      formData.append('speakers', JSON.stringify(editingEvent.speakers.filter(s => s.name.trim())));
      formData.append('schedule', JSON.stringify(editingEvent.schedule.filter(s => s.activity.trim())));

      // Retain existing images
      formData.append('existingImages', JSON.stringify(editingEvent.images || []));

      // Append new gallery uploads
      const newCaptions: string[] = [];
      editNewGalleryFiles.forEach((g) => {
        formData.append('galleryImages', g.file);
        newCaptions.push(g.caption || '');
      });
      formData.append('captions', JSON.stringify(newCaptions));

      await axios.put(`${API_URL}/events/${editingEvent._id}`, formData, apiConfig);

      alert('Event updated successfully!');
      setEditingEvent(null);
      setEditCoverFile(null);
      setEditCoverPreview('');
      setEditNewGalleryFiles([]);
      fetchEvents();
    } catch (error: any) {
      alert('Error updating event: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event and remove all associated Cloudinary images?')) return;

    try {
      await axios.delete(`${API_URL}/events/${id}`, apiConfig);
      alert('Event deleted successfully!');
      fetchEvents();
    } catch (error: any) {
      alert('Error deleting event: ' + (error.response?.data?.message || error.message));
    }
  };

  // LOGIN SCREEN
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
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/50 cursor-pointer"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1121] px-4 py-8 text-slate-100 font-['Inter']">
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
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('council')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all cursor-pointer ${
              activeTab === 'council'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="h-5 w-5" />
            Council Members ({councilMembers.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calendar className="h-5 w-5" />
            Events Controller ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('recruitment')}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all cursor-pointer ${
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
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-6 py-3 font-semibold transition-all cursor-pointer ${
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

        {/* Content Container */}
        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          {/* TAB 1: Council Members */}
          {activeTab === 'council' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Manage Council Members</h2>
              
              {/* Add New Member Form */}
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Add New Member</h3>
                
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
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 cursor-pointer"
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
                  className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
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
                        className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50 cursor-pointer"
                      >
                        {uploading ? 'Updating...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => {
                          setEditingMember(null);
                          setSelectedImage(null);
                          setImagePreview('');
                        }}
                        className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white cursor-pointer"
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white cursor-pointer"
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
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member._id)}
                          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 cursor-pointer"
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

          {/* TAB 2: EVENTS CONTROLLER */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                    Events Controller
                  </h2>
                  <p className="text-xs text-slate-400">Create, edit, and upload past & upcoming events with Cloudinary image hosting</p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setEventTypeFilter('all')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      eventTypeFilter === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({events.length})
                  </button>
                  <button
                    onClick={() => setEventTypeFilter('past')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      eventTypeFilter === 'past' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Past ({events.filter(e => e.type === 'past').length})
                  </button>
                  <button
                    onClick={() => setEventTypeFilter('upcoming')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      eventTypeFilter === 'upcoming' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Upcoming ({events.filter(e => e.type === 'upcoming').length})
                  </button>
                </div>
              </div>

              {/* Create New Event Form Box */}
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Create & Publish New Event
                </h3>

                {/* Cover Image Upload to Cloudinary */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Cover Image (Primary Event Poster) *
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 px-6 py-4 transition-colors hover:border-cyan-500 hover:bg-slate-600">
                      <Upload className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-slate-300">Upload Cover Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCoverSelect(e, false)}
                        className="hidden"
                      />
                    </label>
                    {coverPreview && (
                      <div className="relative">
                        <img
                          src={coverPreview}
                          alt="Cover Preview"
                          className="h-24 w-36 rounded-lg object-cover border border-cyan-500/50 shadow-md"
                        />
                        <button
                          onClick={() => {
                            setCoverFile(null);
                            setCoverPreview('');
                          }}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Image will automatically upload to Cloudinary upon submission</p>
                </div>

                {/* Primary Form Fields */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Event Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Biotech Synergy 2025"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Date String *</label>
                    <input
                      type="text"
                      placeholder="e.g. February 15, 2025"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Event Section Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'past' | 'upcoming' })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500 font-semibold text-emerald-400"
                    >
                      <option value="past">Past Event (Shows in Horizontal Carousel)</option>
                      <option value="upcoming">Upcoming Event (Shows in Upcoming Section)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Conference / Hackathon / Workshop"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Location Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Main Auditorium, DTU"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Attendee Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={newEvent.attendees}
                      onChange={(e) => setNewEvent({ ...newEvent, attendees: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Short Summary Description *</label>
                    <textarea
                      rows={2}
                      placeholder="Short summary displayed on event cards..."
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Event Story (Long Description)</label>
                    <textarea
                      rows={3}
                      placeholder="In-depth story displayed in detail views and lightbox views..."
                      value={newEvent.longDescription}
                      onChange={(e) => setNewEvent({ ...newEvent, longDescription: e.target.value })}
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Event Gallery Multiple Images Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Event Photo Gallery Images (Cloudinary Multi-Upload)
                  </label>
                  <div className="flex flex-wrap items-center gap-4 mb-3">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 px-6 py-3 transition-colors hover:border-cyan-500 hover:bg-slate-600">
                      <Upload className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-slate-300">Add Gallery Photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleGallerySelect(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Selected Gallery Thumbs Grid */}
                  {galleryFiles.length > 0 && (
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {galleryFiles.map((item, idx) => (
                        <div key={idx} className="relative rounded-lg border border-slate-700 bg-slate-900 p-2 space-y-1">
                          <img
                            src={item.previewUrl}
                            alt={`Gallery ${idx}`}
                            className="h-24 w-full rounded object-cover"
                          />
                          <input
                            type="text"
                            placeholder="Caption..."
                            value={item.caption}
                            onChange={(e) => {
                              const val = e.target.value;
                              setGalleryFiles(prev => prev.map((g, i) => i === idx ? { ...g, caption: val } : g));
                            }}
                            className="w-full text-xs rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white outline-none"
                          />
                          <button
                            onClick={() => setGalleryFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dynamic Highlights List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Key Highlights / Takeaways</label>
                    <button
                      type="button"
                      onClick={() => setNewEvent(prev => ({ ...prev, highlights: [...prev.highlights, ''] }))}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      + Add Highlight Point
                    </button>
                  </div>
                  {newEvent.highlights.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`Highlight #${idx + 1}`}
                        value={item}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewEvent(prev => ({
                            ...prev,
                            highlights: prev.highlights.map((h, i) => i === idx ? val : h)
                          }));
                        }}
                        className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                      {newEvent.highlights.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewEvent(prev => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== idx) }))}
                          className="px-2 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Speakers List */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Guest Speakers / Keynote Experts</label>
                    <button
                      type="button"
                      onClick={() => setNewEvent(prev => ({ ...prev, speakers: [...prev.speakers, { name: '', role: '' }] }))}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      + Add Speaker
                    </button>
                  </div>
                  {newEvent.speakers.map((spk, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Speaker Name"
                        value={spk.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewEvent(prev => ({
                            ...prev,
                            speakers: prev.speakers.map((s, i) => i === idx ? { ...s, name: val } : s)
                          }));
                        }}
                        className="w-1/2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Role / Title (e.g. Lead Scientist)"
                        value={spk.role}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewEvent(prev => ({
                            ...prev,
                            speakers: prev.speakers.map((s, i) => i === idx ? { ...s, role: val } : s)
                          }));
                        }}
                        className="w-1/2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                      {newEvent.speakers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewEvent(prev => ({ ...prev, speakers: prev.speakers.filter((_, i) => i !== idx) }))}
                          className="px-2 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Schedule Timeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Event Schedule / Timeline</label>
                    <button
                      type="button"
                      onClick={() => setNewEvent(prev => ({ ...prev, schedule: [...prev.schedule, { time: '', activity: '' }] }))}
                      className="text-xs text-cyan-400 hover:underline cursor-pointer"
                    >
                      + Add Agenda Item
                    </button>
                  </div>
                  {newEvent.schedule.map((sch, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Time (e.g. 10:00 AM)"
                        value={sch.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewEvent(prev => ({
                            ...prev,
                            schedule: prev.schedule.map((s, i) => i === idx ? { ...s, time: val } : s)
                          }));
                        }}
                        className="w-1/3 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                      <input
                        type="text"
                        placeholder="Activity / Session Name"
                        value={sch.activity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewEvent(prev => ({
                            ...prev,
                            schedule: prev.schedule.map((s, i) => i === idx ? { ...s, activity: val } : s)
                          }));
                        }}
                        className="w-2/3 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                      />
                      {newEvent.schedule.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewEvent(prev => ({ ...prev, schedule: prev.schedule.filter((_, i) => i !== idx) }))}
                          className="px-2 text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={handleAddEvent}
                  disabled={uploadingEvent}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {uploadingEvent ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Uploading & Creating Event...
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      Publish Event to Database
                    </>
                  )}
                </button>
              </div>

              {/* Edit Event Modal */}
              {editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
                  <div className="w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-800 p-6 md:p-8 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center border-b border-slate-700 pb-4">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-cyan-400" />
                        Edit Event: <span className="text-cyan-300">{editingEvent.title}</span>
                      </h3>
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setEditCoverFile(null);
                          setEditCoverPreview('');
                          setEditNewGalleryFiles([]);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Cover Image Replacement */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Cover Image (Primary Event Poster) *
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={editCoverPreview || editingEvent.coverImage}
                            alt={editingEvent.title}
                            className="h-24 w-36 rounded-lg object-cover border border-cyan-500/50 shadow-md"
                          />
                        </div>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 px-6 py-4 transition-colors hover:border-cyan-500 hover:bg-slate-600">
                          <Upload className="h-5 w-5 text-cyan-400" />
                          <span className="text-sm text-slate-300">Change Cover Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCoverSelect(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">New cover file will upload to Cloudinary upon saving</p>
                    </div>

                    {/* Primary Form Fields */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Event Title *</label>
                        <input
                          type="text"
                          placeholder="e.g. Biotech Synergy 2025"
                          value={editingEvent.title}
                          onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Date String *</label>
                        <input
                          type="text"
                          placeholder="e.g. February 15, 2025"
                          value={editingEvent.date}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Event Section Type</label>
                        <select
                          value={editingEvent.type}
                          onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as 'past' | 'upcoming' })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500 font-semibold text-emerald-400"
                        >
                          <option value="past">Past Event (Shows in Horizontal Carousel)</option>
                          <option value="upcoming">Upcoming Event (Shows in Upcoming Section)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                        <input
                          type="text"
                          placeholder="e.g. Conference / Hackathon / Workshop"
                          value={editingEvent.category}
                          onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Location Venue</label>
                        <input
                          type="text"
                          placeholder="e.g. Main Auditorium, DTU"
                          value={editingEvent.location || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Attendee Count</label>
                        <input
                          type="number"
                          placeholder="e.g. 500"
                          value={editingEvent.attendees || 0}
                          onChange={(e) => setEditingEvent({ ...editingEvent, attendees: parseInt(e.target.value) || 0 })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Short Summary Description *</label>
                        <textarea
                          rows={2}
                          placeholder="Short summary displayed on event cards..."
                          value={editingEvent.description}
                          onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Detailed Event Story (Long Description)</label>
                        <textarea
                          rows={3}
                          placeholder="In-depth story displayed in detail views and lightbox views..."
                          value={editingEvent.longDescription || ''}
                          onChange={(e) => setEditingEvent({ ...editingEvent, longDescription: e.target.value })}
                          className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    {/* Existing Gallery Photos Management */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Existing Gallery Photos ({editingEvent.images?.length || 0})
                      </label>
                      {editingEvent.images && editingEvent.images.length > 0 ? (
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {editingEvent.images.map((imgItem, idx) => (
                            <div key={idx} className="relative rounded-lg border border-slate-700 bg-slate-900 p-2 space-y-1">
                              <img src={imgItem.url} alt={`Gallery ${idx}`} className="h-24 w-full rounded object-cover" />
                              <input
                                type="text"
                                placeholder="Caption..."
                                value={imgItem.caption || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const updated = editingEvent.images.map((g, i) => i === idx ? { ...g, caption: val } : g);
                                  setEditingEvent({ ...editingEvent, images: updated });
                                }}
                                className="w-full text-xs rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white outline-none focus:border-cyan-500"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = editingEvent.images.filter((_, i) => i !== idx);
                                  setEditingEvent({ ...editingEvent, images: updated });
                                }}
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No existing gallery photos.</p>
                      )}
                    </div>

                    {/* Add New Gallery Photos */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Add New Gallery Photos (Cloudinary Multi-Upload)
                      </label>
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-slate-600 bg-slate-700 px-6 py-3 transition-colors hover:border-cyan-500 hover:bg-slate-600">
                          <Upload className="h-5 w-5 text-cyan-400" />
                          <span className="text-sm text-slate-300">Add Gallery Photos</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleGallerySelect(e, true)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {editNewGalleryFiles.length > 0 && (
                        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                          {editNewGalleryFiles.map((item, idx) => (
                            <div key={idx} className="relative rounded-lg border border-slate-700 bg-slate-900 p-2 space-y-1">
                              <img
                                src={item.previewUrl}
                                alt={`New Gallery ${idx}`}
                                className="h-24 w-full rounded object-cover"
                              />
                              <input
                                type="text"
                                placeholder="Caption..."
                                value={item.caption}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditNewGalleryFiles(prev => prev.map((g, i) => i === idx ? { ...g, caption: val } : g));
                                }}
                                className="w-full text-xs rounded border border-slate-700 bg-slate-800 px-2 py-1 text-white outline-none focus:border-cyan-500"
                              />
                              <button
                                type="button"
                                onClick={() => setEditNewGalleryFiles(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 cursor-pointer"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dynamic Highlights List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300">Key Highlights / Takeaways</label>
                        <button
                          type="button"
                          onClick={() => setEditingEvent(prev => prev ? { ...prev, highlights: [...(prev.highlights || []), ''] } : null)}
                          className="text-xs text-cyan-400 hover:underline cursor-pointer"
                        >
                          + Add Highlight Point
                        </button>
                      </div>
                      {(editingEvent.highlights || ['']).map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Highlight #${idx + 1}`}
                            value={item}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingEvent(prev => prev ? {
                                ...prev,
                                highlights: (prev.highlights || []).map((h, i) => i === idx ? val : h)
                              } : null);
                            }}
                            className="flex-1 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                          />
                          {(editingEvent.highlights || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => setEditingEvent(prev => prev ? {
                                ...prev,
                                highlights: prev.highlights.filter((_, i) => i !== idx)
                              } : null)}
                              className="px-2 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Speakers List */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300">Guest Speakers / Keynote Experts</label>
                        <button
                          type="button"
                          onClick={() => setEditingEvent(prev => prev ? { ...prev, speakers: [...(prev.speakers || []), { name: '', role: '' }] } : null)}
                          className="text-xs text-cyan-400 hover:underline cursor-pointer"
                        >
                          + Add Speaker
                        </button>
                      </div>
                      {(editingEvent.speakers || [{ name: '', role: '' }]).map((spk, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Speaker Name"
                            value={spk.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingEvent(prev => prev ? {
                                ...prev,
                                speakers: (prev.speakers || []).map((s, i) => i === idx ? { ...s, name: val } : s)
                              } : null);
                            }}
                            className="w-1/2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            placeholder="Role / Title (e.g. Lead Scientist)"
                            value={spk.role}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingEvent(prev => prev ? {
                                ...prev,
                                speakers: (prev.speakers || []).map((s, i) => i === idx ? { ...s, role: val } : s)
                              } : null);
                            }}
                            className="w-1/2 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                          />
                          {(editingEvent.speakers || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => setEditingEvent(prev => prev ? {
                                ...prev,
                                speakers: prev.speakers.filter((_, i) => i !== idx)
                              } : null)}
                              className="px-2 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Schedule Timeline */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-300">Event Schedule / Timeline</label>
                        <button
                          type="button"
                          onClick={() => setEditingEvent(prev => prev ? { ...prev, schedule: [...(prev.schedule || []), { time: '', activity: '' }] } : null)}
                          className="text-xs text-cyan-400 hover:underline cursor-pointer"
                        >
                          + Add Agenda Item
                        </button>
                      </div>
                      {(editingEvent.schedule || [{ time: '', activity: '' }]).map((sch, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Time (e.g. 10:00 AM)"
                            value={sch.time}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingEvent(prev => prev ? {
                                ...prev,
                                schedule: (prev.schedule || []).map((s, i) => i === idx ? { ...s, time: val } : s)
                              } : null);
                            }}
                            className="w-1/3 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                          />
                          <input
                            type="text"
                            placeholder="Activity / Session Name"
                            value={sch.activity}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditingEvent(prev => prev ? {
                                ...prev,
                                schedule: (prev.schedule || []).map((s, i) => i === idx ? { ...s, activity: val } : s)
                              } : null);
                            }}
                            className="w-2/3 rounded-lg border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-500"
                          />
                          {(editingEvent.schedule || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => setEditingEvent(prev => prev ? {
                                ...prev,
                                schedule: prev.schedule.filter((_, i) => i !== idx)
                              } : null)}
                              className="px-2 text-red-400 hover:text-red-300 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t border-slate-700">
                      <button
                        onClick={handleUpdateEvent}
                        disabled={uploadingEvent}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 cursor-pointer"
                      >
                        {uploadingEvent ? (
                          <>
                            <Loader className="h-5 w-5 animate-spin" />
                            Updating Event...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Save Event Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingEvent(null);
                          setEditCoverFile(null);
                          setEditCoverPreview('');
                          setEditNewGalleryFiles([]);
                        }}
                        className="rounded-lg border border-slate-600 bg-slate-700 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Events List Grid */}
              <div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    Event Records ({filteredEvents.length}{eventSearch.trim() ? ` of ${events.length}` : ''})
                  </h3>
                  <div className="relative w-full sm:max-w-sm">
                    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={eventSearch}
                      onChange={(event) => setEventSearch(event.target.value)}
                      placeholder="Search title, category, venue..."
                      className="w-full rounded-lg border border-slate-600 bg-slate-700 py-2 pl-10 pr-10 text-white outline-none placeholder:text-slate-400 focus:border-cyan-500"
                    />
                    {eventSearch && (
                      <button
                        type="button"
                        onClick={() => setEventSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {filteredEvents.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((ev) => (
                      <div key={ev._id} className="rounded-xl border border-slate-700 bg-slate-800 p-4 space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3">
                            <img src={ev.coverImage} alt={ev.title} className="h-full w-full object-cover" />
                            <div className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                              ev.type === 'upcoming' ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                            }`}>
                              {ev.type}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-xs text-slate-300">
                              📸 {ev.images ? ev.images.length : 0} photos
                            </div>
                          </div>

                          <h4 className="font-bold text-white text-lg truncate">{ev.title}</h4>
                          <p className="text-xs text-cyan-400 font-medium mb-1">{ev.date} • {ev.category}</p>
                          <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-700">
                          <button
                            onClick={() => {
                              setEditingEvent(ev);
                              setEditCoverPreview('');
                              setEditCoverFile(null);
                              setEditNewGalleryFiles([]);
                            }}
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev._id)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
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
                    No events found in database. Create a new event or run the seed script!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Recruitment Link */}
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
                  className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg cursor-pointer"
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

          {/* TAB 4: Enquiries */}
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
                            className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700 cursor-pointer"
                          >
                            Mark as Read
                          </button>
                        )}
                        {enquiry.status !== 'responded' && (
                          <button
                            onClick={() => handleMarkAsResponded(enquiry._id)}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 cursor-pointer"
                          >
                            Mark as Responded
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEnquiry(enquiry._id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
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
