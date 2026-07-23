'use client';

import React, { useEffect, useState } from 'react';
import { getDashboardStats, getProjects } from '@/services/api';
import { 
  FileText, 
  CalendarDays, 
  Banknote, 
  CreditCard,
  Users,
  UserCheck,
  UserMinus,
  FolderClock
} from 'lucide-react';
import { motion } from 'framer-motion';
import RecentActivity from './components/RecentActivity';
import CalendarView from './components/CalendarView';
import { Project } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalQuotations: 0,
    totalBookings: 0,
    pendingPaymentsAmount: 0,
    revenue: 0,
    totalProjects: 0,
    finishedProjects: 0,
    pendingProjects: 0,
    totalCrew: 0,
    totalCrewAssigned: 0,
    totalCrewNotAssigned: 0,
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getProjects()
    ]).then(([statsData, projectsData]) => {
      setStats(statsData);
      setProjects(projectsData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="glass-card p-4 h-20"></div>
        ))}
      </div>
    </div>;
  }

  return (
    <>
      {/* Statistics Bento Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        
        {/* Card 1 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Total Quotations</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.totalQuotations}</h3>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="text-primary w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Finished Projects</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.finishedProjects}</h3>
          </div>
          <div className="p-2 bg-secondary/10 rounded-lg">
            <CalendarDays className="text-secondary w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Payments Recv.</p>
            <h3 className="text-[22px] font-medium text-primary">₹{stats.revenue.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-green-100 rounded-lg">
            <CreditCard className="text-green-700 w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Pending Payments</p>
            <h3 className="text-[22px] font-medium text-primary">₹{stats.pendingPaymentsAmount.toLocaleString()}</h3>
          </div>
          <div className="p-2 bg-amber-100 rounded-lg">
            <CreditCard className="text-amber-700 w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 5 */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Total Bookings</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.totalProjects}</h3>
          </div>
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="text-purple-700 w-5 h-5" />
          </div>
        </motion.div>
        
        {/* Card 6: Pending Projects */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Pending Projects</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.pendingProjects}</h3>
          </div>
          <div className="p-2 bg-orange-100 rounded-lg">
            <FolderClock className="text-orange-700 w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 7: Total Crew */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Total Crew</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.totalCrew}</h3>
          </div>
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="text-blue-700 w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 8: Crew Assigned */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Crew Assigned</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.totalCrewAssigned}</h3>
          </div>
          <div className="p-2 bg-emerald-100 rounded-lg">
            <UserCheck className="text-emerald-700 w-5 h-5" />
          </div>
        </motion.div>

        {/* Card 9: Crew Not Assigned */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider mb-1">Crew Unassigned</p>
            <h3 className="text-[22px] font-medium text-primary">{stats.totalCrewNotAssigned}</h3>
          </div>
          <div className="p-2 bg-rose-100 rounded-lg">
            <UserMinus className="text-rose-700 w-5 h-5" />
          </div>
        </motion.div>
        
      </section>

      {/* Placeholder for Charts and Tables */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-6 min-h-[300px]">
          <CalendarView projects={projects} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6 min-h-[300px]">
          <RecentActivity />
        </motion.div>
      </section>
    </>
  );
}
