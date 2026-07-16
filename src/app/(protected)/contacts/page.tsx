'use client';

import React, { useEffect, useState } from 'react';
import { getContacts } from '@/services/api';
import { Contact } from '@/lib/types';
import { 
  Upload, 
  UserPlus, 
  MapPin, 
  MoreVertical,
  ChevronDown,
  Filter
} from 'lucide-react';
import dayjs from 'dayjs';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContacts().then((data) => {
      setContacts(data);
      setLoading(false);
    });
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active Lead':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">{status}</span>;
      case 'Negotiation':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight bg-secondary/10 text-secondary border border-secondary/20">{status}</span>;
      case 'Closed':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight bg-green-100 text-green-700 border border-green-200">{status}</span>;
      case 'Urgent Follow-up':
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight bg-error-container/50 text-error border border-error/20">{status}</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight bg-surface-variant text-on-surface-variant">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header / Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-[32px] font-semibold text-primary tracking-tight">Client Directory</h3>
          <p className="text-[16px] text-on-surface-variant opacity-80">Manage your professional connections</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-outline-variant/30 rounded-xl text-[14px] font-medium text-primary shadow-sm hover:shadow-md hover:bg-surface-container transition-all">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-xl text-[14px] font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <UserPlus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Main Table Glass Card */}
      <div className="glass-card rounded-[20px] overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center text-primary">Loading contacts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/10">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      Name <ChevronDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/10">Email & Phone</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/10">Location</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/10">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      Lead Status <Filter className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant/70 border-b border-outline-variant/10">Created Date</th>
                  <th className="px-6 py-4 border-b border-outline-variant/10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="group hover:bg-primary/[0.02] cursor-pointer transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-primary font-bold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-primary group-hover:underline">{contact.name}</p>
                          <p className="text-[12px] text-on-surface-variant">{contact.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-0.5">
                        <p className="text-[14px] font-medium">{contact.email}</p>
                        <p className="text-[12px] text-on-surface-variant">{contact.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1 text-[14px] text-on-surface-variant">
                        <MapPin className="w-4 h-4 text-outline-variant" />
                        {contact.location}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-5 text-[14px] text-on-surface-variant">
                      {dayjs(contact.createdAt).format('MMM DD, YYYY')}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-5 h-5 text-outline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
