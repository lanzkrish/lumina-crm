'use client';

import React, { useState, useEffect } from 'react';
import { getCrew, createCrew, updateCrew, deleteCrew } from '@/app/actions';
import { 
  Plus, 
  MapPin, 
  Phone, 
  Briefcase, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlueprintPage() {
  const [crewData, setCrewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLocations, setExpandedLocations] = useState<Record<string, boolean>>({});
  const [selectedRole, setSelectedRole] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    location: '',
    phone: '',
    address: '',
    charges: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getCrew();
      setCrewData(data);
      // Auto-expand all locations by default
      const locs = Array.from(new Set(data.map((c: any) => c.location)));
      const expandState: Record<string, boolean> = {};
      locs.forEach((l: any) => (expandState[l] = true));
      setExpandedLocations(expandState);
    } catch (e) {
      toast.error('Failed to load blueprint data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute unique locations and roles for datalists
  const uniqueLocations = Array.from(new Set(crewData.map(c => c.location)));
  const uniqueRoles = Array.from(new Set(crewData.map(c => c.role)));

  // Group data by location (with role filter applied)
  const groupedData: Record<string, any[]> = {};
  crewData.forEach(c => {
    if (selectedRole !== 'All' && c.role !== selectedRole) return;
    
    if (!groupedData[c.location]) {
      groupedData[c.location] = [];
    }
    groupedData[c.location].push(c);
  });

  const handleToggleLocation = (loc: string) => {
    setExpandedLocations(prev => ({ ...prev, [loc]: !prev[loc] }));
  };

  const openAddModal = () => {
    setFormData({ name: '', role: '', location: '', phone: '', address: '', charges: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (crew: any) => {
    setFormData({
      name: crew.name,
      role: crew.role,
      location: crew.location,
      phone: crew.phone,
      address: crew.address,
      charges: crew.charges.toString()
    });
    setEditingId(crew._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this crew member?')) return;
    try {
      await deleteCrew(id);
      toast.success('Crew member removed');
      fetchData();
    } catch (e) {
      toast.error('Failed to remove');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      charges: parseInt(formData.charges) || 0
    };

    try {
      if (editingId) {
        await updateCrew(editingId, payload);
        toast.success('Updated successfully');
      } else {
        await createCrew(payload);
        toast.success('Added to Blueprint successfully');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-10 w-48 bg-surface-variant rounded-xl mb-8"></div>
      <div className="h-64 bg-surface-variant rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-medium text-primary tracking-tight">Crew Blueprint</h1>
          <p className="text-on-surface-variant text-[14px]">Manage your photographers, editors, and locations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px] text-on-surface"
          >
            <option value="All">All Roles</option>
            {uniqueRoles.map((role: any) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button 
            onClick={openAddModal}
            className="bg-primary text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium text-[14px]">Add Crew</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.keys(groupedData).length === 0 ? (
          <div className="text-center py-20 bg-surface-variant/30 rounded-2xl border border-dashed border-outline-variant">
            <Briefcase className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No crew members found.</p>
            <p className="text-on-surface-variant/70 text-[14px] mt-1">Add your first photographer or editor to the blueprint.</p>
          </div>
        ) : (
          Object.entries(groupedData).map(([location, members]) => (
            <div key={location} className="glass-card overflow-hidden">
              <button 
                onClick={() => handleToggleLocation(location)}
                className="w-full flex items-center justify-between p-5 bg-primary/5 hover:bg-primary/10 transition-colors border-b border-outline-variant/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-[18px] font-medium text-primary">{location}</h3>
                  <span className="bg-primary/10 text-primary text-[12px] px-2 py-0.5 rounded-full font-medium">
                    {members.length} members
                  </span>
                </div>
                {expandedLocations[location] ? <ChevronUp className="text-primary w-5 h-5" /> : <ChevronDown className="text-primary w-5 h-5" />}
              </button>
              
              <AnimatePresence>
                {expandedLocations[location] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-x-auto"
                  >
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30 text-[12px] uppercase tracking-wider text-on-surface-variant bg-surface-variant/20">
                          <th className="p-4 font-semibold">Name & Role</th>
                          <th className="p-4 font-semibold">Contact</th>
                          <th className="p-4 font-semibold">Address</th>
                          <th className="p-4 font-semibold">Daily Charge</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((crew) => (
                          <tr key={crew._id} className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors group">
                            <td className="p-4">
                              <p className="font-medium text-on-surface">{crew.name}</p>
                              <span className="inline-flex mt-1 items-center gap-1 bg-secondary/10 text-secondary text-[11px] px-2 py-0.5 rounded-full font-medium">
                                <Briefcase className="w-3 h-3" /> {crew.role}
                              </span>
                            </td>
                            <td className="p-4 text-[14px] text-on-surface-variant">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" />
                                {crew.phone}
                              </div>
                            </td>
                            <td className="p-4 text-[14px] text-on-surface-variant max-w-[200px] truncate">
                              {crew.address}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5 text-primary font-medium">
                                <CreditCard className="w-4 h-4" />
                                ₹{crew.charges.toLocaleString()}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModal(crew)} className="p-1.5 text-secondary hover:bg-secondary/10 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(crew._id)} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* Datalists for Combobox behavior */}
      <datalist id="locations-list">
        {uniqueLocations.map((loc, idx) => <option key={idx} value={loc as string} />)}
      </datalist>
      <datalist id="roles-list">
        {uniqueRoles.map((role, idx) => <option key={idx} value={role as string} />)}
      </datalist>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="flex justify-between items-center p-6 border-b border-outline-variant/30 bg-surface-container-lowest">
                <h2 className="text-[20px] font-medium text-primary">
                  {editingId ? 'Edit Crew Member' : 'Add New Crew'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase">Full Name</label>
                    <input 
                      required
                      type="text"
                      className="w-full bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase">Phone Number</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase flex items-center gap-1">
                      Role / Segment 
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm normal-case">Select or Type</span>
                    </label>
                    <input 
                      required
                      list="roles-list"
                      type="text"
                      className="w-full bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. Photographer, Light Man"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-semibold text-on-surface-variant uppercase flex items-center gap-1">
                      Location
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm normal-case">Select or Type</span>
                    </label>
                    <input 
                      required
                      list="locations-list"
                      type="text"
                      className="w-full bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. Berlin, Mumbai"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[12px] font-semibold text-on-surface-variant uppercase">Full Address</label>
                  <input 
                    required
                    type="text"
                    className="w-full bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Complete residential/studio address"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[12px] font-semibold text-on-surface-variant uppercase">Daily Charges (₹)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    className="w-full bg-surface-variant/50 border border-outline-variant/50 px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="e.g. 5000"
                    value={formData.charges}
                    onChange={e => setFormData({...formData, charges: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-surface-variant hover:bg-outline-variant/30 text-on-surface font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                  >
                    {editingId ? 'Save Changes' : 'Add to Blueprint'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
