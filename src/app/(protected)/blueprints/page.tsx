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
  CreditCard,
  LayoutGrid,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlueprintPage() {
  const [crewData, setCrewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  
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

  // Filter data by search location and selected role
  const filteredData = crewData.filter(c => {
    const matchRole = selectedRole === 'All' || c.role === selectedRole;
    const matchLocation = searchLocation === '' || c.location.toLowerCase().includes(searchLocation.toLowerCase());
    return matchRole && matchLocation;
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-outline-variant/30 pb-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
            <input 
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-variant/30 border border-outline-variant/50 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[14px] text-on-surface"
              placeholder="Location..."
            />
          </div>
        </div>
        
        <div className="flex-1 flex overflow-x-auto custom-scrollbar px-2 pb-2 sm:pb-0 gap-2 items-center min-w-0">
          <button 
            onClick={() => setSelectedRole('All')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${selectedRole === 'All' ? 'bg-primary text-on-primary' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant/80'}`}
          >
            All Roles
          </button>
          {uniqueRoles.map((role: any) => (
            <button 
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors ${selectedRole === role ? 'bg-primary text-on-primary' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant/80'}`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-variant/50 p-1 rounded-full flex gap-1">
            <button 
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-full transition-colors ${viewMode === 'card' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={openAddModal}
            className="shrink-0 bg-primary text-white px-4 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium text-[14px] hidden sm:inline">Add Crew</span>
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-20 bg-surface-variant/30 rounded-2xl border border-dashed border-outline-variant">
          <Briefcase className="w-12 h-12 text-on-surface-variant/50 mx-auto mb-3" />
          <p className="text-on-surface-variant font-medium">No crew members found.</p>
          <p className="text-on-surface-variant/70 text-[14px] mt-1">Try adjusting your filters or add a new member.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-variant/30 text-on-surface-variant text-[12px] uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Charges</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredData.map(crew => (
                <tr key={crew._id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[16px]">
                        {crew.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-[15px] text-on-surface">{crew.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] font-medium text-primary uppercase bg-primary/10 px-2 py-1 rounded-md">{crew.role}</span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant text-[14px]">{crew.location}</td>
                  <td className="px-6 py-4 text-on-surface-variant text-[14px]">{crew.phone}</td>
                  <td className="px-6 py-4 text-primary font-semibold text-[14px]">₹{crew.charges.toLocaleString()} / day</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(crew)} className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(crew._id)} className="p-1.5 text-error hover:bg-error/10 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map(crew => (
            <div key={crew._id} className="glass-card rounded-2xl overflow-hidden group relative flex flex-col shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-shadow">
              {/* Gradient Header */}
              <div className="h-32 bg-gradient-to-br from-primary/80 to-primary/40 relative">
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                {/* Actions Dropdown */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(crew)} className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(crew._id)} className="p-1.5 bg-error/80 hover:bg-error backdrop-blur-md rounded-full text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Avatar */}
              <div className="px-6 relative -mt-10 mb-2">
                <div className="w-20 h-20 rounded-full border-4 border-surface bg-primary text-white flex items-center justify-center text-[28px] font-bold shadow-md">
                  {crew.name.charAt(0).toUpperCase()}
                </div>
              </div>
              
              {/* Info section */}
              <div className="px-6 pb-6 flex-1 flex flex-col">
                <h3 className="text-[18px] font-bold text-on-surface leading-tight">{crew.name}</h3>
                <p className="text-[13px] font-semibold tracking-wide text-primary mb-3 uppercase">{crew.role}</p>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-outline-variant/20">
                  <div className="flex items-start gap-2 text-on-surface-variant text-[13px]">
                    <MapPin className="w-4 h-4 shrink-0 text-primary/70" />
                    <span className="truncate">{crew.location}</span>
                  </div>
                  <div className="flex items-start gap-2 text-on-surface-variant text-[13px]">
                    <Phone className="w-4 h-4 shrink-0 text-primary/70" />
                    <span>{crew.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-on-surface-variant text-[13px]">
                    <CreditCard className="w-4 h-4 shrink-0 text-primary/70" />
                    <span className="font-semibold text-primary">₹{crew.charges.toLocaleString()} / day</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
