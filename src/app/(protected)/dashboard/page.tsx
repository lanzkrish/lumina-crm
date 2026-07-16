'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/api';
import { 
  FileText, 
  CalendarDays, 
  Banknote, 
  CreditCard,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import RecentActivity from './components/RecentActivity';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalQuotations: 0,
    totalBookings: 0,
    pendingPaymentsAmount: 0,
    revenue: 0,
    totalContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="glass-card p-5 h-32"></div>
        ))}
      </div>
    </div>;
  }

  return (
    <>
      {/* Statistics Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        
        {/* Card 1 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="text-primary w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider">Total Quotations</p>
            <h3 className="text-[24px] font-medium text-primary mt-1">{stats.totalQuotations}</h3>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <CalendarDays className="text-secondary w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-[24px] font-medium text-primary mt-1">{stats.totalBookings}</h3>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="text-green-700 w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider">Payments Recv.</p>
            <h3 className="text-[24px] font-medium text-primary mt-1">₹{stats.revenue.toLocaleString()}</h3>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <CreditCard className="text-amber-700 w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider">Pending Payments</p>
            <h3 className="text-[24px] font-medium text-primary mt-1">₹{stats.pendingPaymentsAmount.toLocaleString()}</h3>
          </div>
        </motion.div>

        {/* Card 5 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary-container/20 rounded-lg">
              <Users className="text-primary-container w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-on-surface-variant text-[12px] font-semibold uppercase tracking-wider">Total Contacts</p>
            <h3 className="text-[24px] font-medium text-primary mt-1">{stats.totalContacts}</h3>
          </div>
        </motion.div>
        
      </section>

      {/* Placeholder for Charts and Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 min-h-[300px] flex items-center justify-center text-outline">
          Chart Placeholder (Revenue Trend)
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 min-h-[300px]">
          <RecentActivity />
        </motion.div>
      </section>
    </>
  );
}
