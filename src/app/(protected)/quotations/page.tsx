'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, FileText, Edit2, Trash2 } from 'lucide-react';
import { getQuotations, deleteQuotation } from '@/app/actions';
import { Quotation } from '@/lib/types';
import dayjs from 'dayjs';
import Link from 'next/link';
import { toast } from 'sonner';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

export default function QuotationsDashboardPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const data = await getQuotations();
      setQuotations(data);
    } catch (e) {
      console.error('Failed to fetch quotations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleDelete = async () => {
    if (!quotationToDelete) return;
    try {
      await deleteQuotation(quotationToDelete);
      toast.success('Quotation deleted successfully!');
      fetchQuotations();
    } catch (e) {
      toast.error('Failed to delete quotation');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-on-surface">Quotations</h1>
          <p className="text-on-surface-variant mt-1 text-[16px]">Manage and view all your generated quotations.</p>
        </div>
        <Link 
          href="/quotations/create"
          className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-full hover:bg-primary/90 transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Add New Quotation
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="glass-card p-6 rounded-xl flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            className="w-full pl-12 pr-6 py-3 bg-transparent border-b border-outline-variant hover:border-primary transition-all text-[16px] focus:outline-none focus:border-primary" 
            placeholder="Search customer, email..." 
            type="text"
          />
        </div>
      </div>

      {/* Quotations Table */}
      <div className="glass-card rounded-[20px] overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center text-primary">Loading quotations...</div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50">
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Customer Name</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Event Type</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Date</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Total Amount</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {quotations.map(quotation => (
                  <tr key={quotation._id || quotation.id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-[10px] text-primary">
                          {(quotation.customerName || 'C').split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium text-on-surface">{quotation.customerName}</div>
                          <div className="text-[12px] text-on-surface-variant">{quotation.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-[14px] font-medium text-on-surface-variant">{quotation.eventType}</td>
                    <td className="px-6 py-6 text-[14px] font-medium text-on-surface-variant">
                      {quotation.bookingDate ? dayjs(quotation.bookingDate).format('DD MMM YYYY') : dayjs(quotation.createdAt).format('DD MMM YYYY')}
                    </td>
                    <td className="px-6 py-6 text-[16px] font-medium text-primary">₹{(quotation.grandTotal || 0).toLocaleString()}</td>
                    <td className="px-6 py-6">
                      <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-[12px] font-bold tracking-wider">
                        GENERATED
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/quotations/edit/${quotation._id || quotation.id}`}
                          className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
                          title="Edit Quotation"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuotationToDelete(quotation._id || quotation.id || '');
                          }} 
                          className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                          title="Delete Quotation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {quotations.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No quotations found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={!!quotationToDelete}
        onClose={() => setQuotationToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Quotation"
        message="Are you sure you want to delete this quotation? This action cannot be undone."
        confirmText="Delete Quotation"
        isDestructive={true}
      />
    </div>
  );
}
