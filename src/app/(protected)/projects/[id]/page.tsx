import React from 'react';
import { getProjectById } from '@/app/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, CreditCard, Users, MapPin, Plus, FileSignature } from 'lucide-react';
import dayjs from 'dayjs';

export default async function ProjectDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await getProjectById(resolvedParams.id);

  if (!project) {
    notFound();
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Lead':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">{status}</span>;
      case 'Negotiation':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight bg-secondary/10 text-secondary border border-secondary/20">{status}</span>;
      case 'Booked':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight bg-green-100 text-green-700 border border-green-200">{status}</span>;
      case 'Completed':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight bg-blue-100 text-blue-700 border border-blue-200">{status}</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight bg-surface-variant text-on-surface-variant">{status}</span>;
    }
  };

  const quotations = project.quotationsList || [];
  const payments = project.paymentsList || [];
  
  const totalPaid = payments.filter((p: any) => p.status === 'PAID' || p.status === 'Verified').reduce((acc: number, p: any) => acc + p.amount, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </Link>
          <div>
            <h3 className="text-[32px] font-semibold text-primary tracking-tight">{project.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[14px] text-on-surface-variant font-medium">{project.company || project.eventType}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              {getStatusBadge(project.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Details & Crew */}
        <div className="space-y-6 lg:col-span-1">
          {/* Project Info */}
          <div className="glass-card p-6 rounded-[24px]">
            <h4 className="text-[16px] font-semibold text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Project Details
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-[12px] text-on-surface-variant">Client Phone</p>
                <p className="text-[14px] font-medium">{project.phone}</p>
              </div>
              <div>
                <p className="text-[12px] text-on-surface-variant">Client Email</p>
                <p className="text-[14px] font-medium">{project.email}</p>
              </div>
              <div>
                <p className="text-[12px] text-on-surface-variant">Location</p>
                <p className="text-[14px] font-medium">{project.location}</p>
              </div>
              {project.eventDate && (
                <div>
                  <p className="text-[12px] text-on-surface-variant">Event Date</p>
                  <p className="text-[14px] font-medium">{dayjs(project.eventDate).format('MMM DD, YYYY')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Crew Blueprint */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[16px] font-semibold text-primary flex items-center gap-2">
                <Users className="w-4 h-4" /> Crew Blueprint
              </h4>
              <button className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {(project.crewBlueprint || []).length === 0 ? (
              <div className="text-center py-6 text-on-surface-variant/60">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-[13px]">No crew members assigned yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {project.crewBlueprint.map((crew: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                    <div>
                      <p className="text-[14px] font-medium">{crew.role}</p>
                      <p className="text-[12px] text-on-surface-variant">{crew.assignedCrewId ? 'Assigned' : 'Unassigned'}</p>
                    </div>
                    <span className="text-[14px] font-semibold text-primary">₹{crew.charges}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quotations & Payments */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Quotations */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[18px] font-semibold text-primary flex items-center gap-2">
                <FileText className="w-5 h-5" /> Quotations
              </h4>
              <Link 
                href={`/quotations/create?projectId=${project._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-[13px] font-medium hover:bg-primary/20 transition-all"
              >
                <Plus className="w-4 h-4" /> New Quotation
              </Link>
            </div>
            
            {quotations.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant/60">
                <FileSignature className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-[14px]">No quotations generated for this project.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quotations.map((q: any) => (
                  <Link href={`/quotations/edit/${q._id}`} key={q._id} className="block group">
                    <div className="p-5 rounded-2xl border border-outline-variant/30 bg-surface hover:border-primary/50 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[12px] text-on-surface-variant">{dayjs(q.createdAt).format('MMM DD, YYYY')}</p>
                        <span className="text-[16px] font-bold text-primary">₹{q.grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[14px] font-medium text-on-surface group-hover:text-primary transition-colors">
                        {q.services.length} Service{q.services.length !== 1 && 's'}
                      </p>
                      <p className="text-[12px] text-on-surface-variant mt-1 line-clamp-1">
                        {q.services.map((s: any) => s.name).join(', ')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Payments */}
          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[18px] font-semibold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> Payments Received
              </h4>
              <div className="text-right">
                <p className="text-[12px] text-on-surface-variant">Total Paid</p>
                <p className="text-[20px] font-bold text-green-600">₹{totalPaid.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="text-center py-10 text-on-surface-variant/60 border border-dashed border-outline-variant/50 rounded-[16px]">
                <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-[14px]">No payments recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((p: any) => (
                  <div key={p._id} className="flex justify-between items-center p-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest">
                    <div>
                      <p className="text-[14px] font-semibold text-primary">₹{p.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[12px] text-on-surface-variant mt-0.5">{dayjs(p.date).format('MMM DD, YYYY')} • {p.paymentMethod}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${p.status === 'PAID' || p.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-secondary/10 text-secondary'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
