'use client';

import React, { useEffect, useState } from 'react';
import { getPayments } from '@/services/api';
import { Payment } from '@/lib/types';
import { 
  Search, 
  ChevronDown,
  TrendingUp,
  CheckCircle2,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  X
} from 'lucide-react';
import dayjs from 'dayjs';
import { verifyPayment } from '@/app/actions';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    const data = await getPayments();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (id: string) => {
    try {
      await verifyPayment(id);
      toast.success('Payment verified successfully!');
      fetchPayments();
    } catch (e) {
      toast.error('Failed to verify payment');
    }
  };

  const totalReceived = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const todayCollections = payments
    .filter(p => p.status === 'PAID' && dayjs(p.date).isSame(dayjs(), 'day'))
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-12">
      {/* Bento Grid Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Received */}
        <div className="glass-card p-8 rounded-xl flex flex-col justify-between h-44">
          <div>
            <span className="text-on-surface-variant text-[14px] font-medium flex items-center gap-2">
              Total Received
              <TrendingUp className="text-primary w-4 h-4" />
            </span>
            <div className="mt-4 text-[32px] font-semibold text-primary tracking-tight">₹{totalReceived.toLocaleString()}</div>
          </div>
          <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
            <div className="bg-primary w-4/5 h-full rounded-full transition-all duration-1000"></div>
          </div>
        </div>

        {/* Pending */}
        <div className="glass-card p-8 rounded-xl flex flex-col justify-between h-44">
          <div>
            <span className="text-on-surface-variant text-[14px] font-medium">Pending Collections</span>
            <div className="mt-4 text-[32px] font-semibold text-primary tracking-tight">₹{pendingAmount.toLocaleString()}</div>
          </div>
          <div className="text-[12px] text-on-surface-variant font-medium">
            {payments.filter(p => p.status === 'PENDING').length} invoices awaiting payment
          </div>
        </div>

        {/* Today */}
        <div className="glass-card p-8 rounded-xl bg-primary-container text-white h-44">
          <span className="text-on-primary-container text-[14px] font-medium">Today's Collection</span>
          <div className="mt-4 text-[32px] font-semibold tracking-tight text-white">₹{todayCollections.toLocaleString()}</div>
          <div className="mt-2 text-[12px] opacity-80 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {payments.filter(p => p.status === 'PAID' && dayjs(p.date).isSame(dayjs(), 'day')).length} payments processed
          </div>
        </div>

        {/* Month */}
        <div className="glass-card p-8 rounded-xl flex flex-col justify-between h-44">
          <div>
            <span className="text-on-surface-variant text-[14px] font-medium">This Month</span>
            <div className="mt-4 text-[32px] font-semibold text-primary tracking-tight">₹{totalReceived.toLocaleString()}</div>
          </div>
          <div className="flex items-center gap-1 text-green-600 text-[14px] font-medium">
            <ArrowUp className="w-4 h-4" />
            12% vs last month
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="glass-card p-6 rounded-xl flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input 
            className="w-full pl-12 pr-6 py-3 bg-transparent border-b border-outline-variant hover:border-primary transition-all text-[16px] focus:outline-none focus:border-primary" 
            placeholder="Search customer, ID, or phone..." 
            type="text"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <select className="bg-transparent border-b border-outline-variant py-3 px-4 text-[14px] font-medium focus:outline-none focus:border-primary min-w-[140px] cursor-pointer">
            <option>Status: All</option>
            <option>Status: Paid</option>
            <option>Status: Pending</option>
          </select>
          <select className="bg-transparent border-b border-outline-variant py-3 px-4 text-[14px] font-medium focus:outline-none focus:border-primary min-w-[140px] cursor-pointer">
            <option>Date: Last 30 Days</option>
            <option>Date: This Quarter</option>
            <option>Date: Year to Date</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card rounded-[20px] overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center text-primary">Loading payments...</div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/50">
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Payment ID</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Customer Name</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Amount</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Method</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Status</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Date</th>
                    <th className="px-6 py-4 text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-primary/5 transition-colors group cursor-pointer">
                      <td className="px-6 py-6 text-[14px] font-medium text-primary">#{payment.id.substring(0, 8).toUpperCase()}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center font-bold text-[10px] text-primary">
                            {payment.customerName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-[14px] font-medium text-on-surface">{payment.customerName}</div>
                            <div className="text-[12px] text-on-surface-variant">Client</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-[18px] font-medium text-primary">₹{payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-6 text-[14px] font-medium text-on-surface-variant">{payment.paymentMethod}</td>
                      <td className="px-6 py-6">
                        {payment.status === 'PAID' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[12px] font-bold tracking-wider">PAID</span>
                        ) : (
                          <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-[12px] font-bold tracking-wider">PENDING</span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-[14px] font-medium text-on-surface-variant">{dayjs(payment.date).format('DD MMM YYYY')}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          {payment.status === 'PENDING' && (
                            <button 
                              onClick={() => handleVerify(payment._id || payment.id)} 
                              className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-[12px] font-bold tracking-wider flex items-center gap-1 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verify
                            </button>
                          )}
                          {payment.screenshotUrl && (
                            <button 
                              onClick={() => setSelectedScreenshot(payment.screenshotUrl)} 
                              className="text-primary hover:bg-primary/10 p-1.5 rounded-lg text-[14px] font-medium transition-colors flex items-center gap-1"
                              title="View Proof"
                            >
                              <ImageIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-between items-center">
              <p className="text-[14px] font-medium text-on-surface-variant">Showing 1 to {payments.length} of {payments.length} payments</p>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-[14px] font-medium">1</button>
                <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedScreenshot && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-3xl w-full bg-surface rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-2 bg-black/50 text-white hover:bg-black/80 rounded-full transition-colors backdrop-blur-md"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <img src={selectedScreenshot} alt="Payment Proof" className="w-full h-auto max-h-[85vh] object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
