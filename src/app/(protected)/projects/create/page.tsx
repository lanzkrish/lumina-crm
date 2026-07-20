'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createProject, getEventTypes, createEventType } from '@/app/actions';

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    location: '',
    eventType: '',
    eventDate: '',
    status: 'Lead',
    notes: ''
  });
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [isCustomEvent, setIsCustomEvent] = useState(false);

  React.useEffect(() => {
    getEventTypes().then(setEventTypes);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.eventType) {
      toast.error('Please fill in the required fields: Name, Phone, Email, Event Type');
      return;
    }
    
    setLoading(true);
    try {
      let finalEventType = formData.eventType;
      if (isCustomEvent && finalEventType) {
        const newType = await createEventType(finalEventType);
        finalEventType = newType.name;
      }

      const dataToSave = {
        ...formData,
        eventType: finalEventType,
        eventDate: formData.eventDate ? new Date(formData.eventDate) : undefined
      };
      const newProject = await createProject(dataToSave);
      toast.success('Project created successfully!');
      router.push(`/projects/${newProject._id}`);
    } catch (e) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-surface-variant rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </button>
          <h2 className="text-[24px] font-semibold text-primary">New Project</h2>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Project'}
        </button>
      </div>

      <div className="glass-card p-6 md:p-8 rounded-[24px] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Client Name *</label>
            <input 
              name="name" value={formData.name} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary" 
              placeholder="e.g. John Doe" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Company / Organization</label>
            <input 
              name="company" value={formData.company} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary" 
              placeholder="e.g. Stitch Agency" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Phone Number *</label>
            <input 
              name="phone" value={formData.phone} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary" 
              placeholder="+91 98765 43210" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Email Address *</label>
            <input 
              name="email" type="email" value={formData.email} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary" 
              placeholder="client@example.com" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Location *</label>
            <input 
              name="location" value={formData.location} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary" 
              placeholder="e.g. Mumbai, India" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Event Type *</label>
            <div className="flex items-center gap-2">
              {!isCustomEvent ? (
                <select 
                  value={formData.eventType} 
                  onChange={(e) => {
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomEvent(true);
                      setFormData(prev => ({ ...prev, eventType: '' }));
                    } else {
                      handleChange(e);
                    }
                  }}
                  name="eventType"
                  className="w-full bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary"
                >
                  <option value="">Select event type...</option>
                  {eventTypes.map((t: any) => (
                    <option key={t._id} value={t.name}>{t.name}</option>
                  ))}
                  {eventTypes.length === 0 && (
                    <>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Commercial Shoot">Commercial Shoot</option>
                      <option value="Portrait Session">Portrait Session</option>
                    </>
                  )}
                  <option value="CUSTOM">+ Add New Event Type</option>
                </select>
              ) : (
                <div className="w-full flex items-center gap-2 border-b border-outline-variant py-1 focus-within:border-primary">
                  <input 
                    type="text"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full bg-transparent focus:outline-none py-1"
                    placeholder="Type new event type..."
                    autoFocus
                  />
                  <button 
                    onClick={() => {
                      setIsCustomEvent(false);
                      setFormData(prev => ({ ...prev, eventType: '' }));
                    }}
                    className="text-xs text-on-surface-variant hover:text-primary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Event Date</label>
            <input 
              type="date" name="eventDate" value={formData.eventDate} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary" 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Project Status</label>
            <select 
              name="status" value={formData.status} onChange={handleChange}
              className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary"
            >
              <option value="Lead">Lead</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Booked">Booked</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-[12px] font-semibold text-on-surface-variant mb-1">Notes / Requirements</label>
            <textarea 
              name="notes" value={formData.notes} onChange={handleChange} rows={3}
              className="bg-transparent border border-outline-variant rounded-lg p-3 focus:outline-none focus:border-primary" 
              placeholder="Any specific requirements or notes..." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
