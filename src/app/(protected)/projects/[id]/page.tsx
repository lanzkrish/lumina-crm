'use client';

import React, { useEffect, useState, use } from 'react';
import { getProjectById, updateProject, addProjectExpense, deleteProject, addProjectCrew, getCrew } from '@/app/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, MapPin, Plus, Receipt, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { toast } from 'sonner';

export default function ProjectDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Expense Modal State
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ date: dayjs().format('YYYY-MM-DD'), description: '', amount: '' });

  // Add Crew State
  const [showCrewModal, setShowCrewModal] = useState(false);
  const [crewForm, setCrewForm] = useState({ role: '', charges: '', assignedCrewId: '' });
  const [availableCrews, setAvailableCrews] = useState<any[]>([]);
  const [crewSearch, setCrewSearch] = useState('');
  const [crewRoleFilter, setCrewRoleFilter] = useState('');

  // Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchProjectAndCrew = async () => {
    const [projectData, crewData] = await Promise.all([
      getProjectById(resolvedParams.id),
      getCrew()
    ]);
    setProject(projectData);
    setAvailableCrews(crewData);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectAndCrew();
  }, [resolvedParams.id]);

  if (loading) return <div className="p-10 flex justify-center text-primary">Loading project...</div>;
  if (!project) return <div className="p-10 text-center">Project not found</div>;

  const payments = project.paymentsList || [];
  const expenses = project.expenses || [];
  
  const totalReceived = payments.filter((p: any) => p.status === 'PAID' || p.status === 'Verified').reduce((acc: number, p: any) => acc + p.amount, 0);
  const pendingAmount = Math.max(0, project.totalValue - totalReceived);
  const totalExpenses = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);
  
  // Ledger Items
  const ledgerItems = [
    ...payments.filter((p: any) => p.status === 'PAID' || p.status === 'Verified').map((p: any) => ({
      type: 'IN',
      date: dayjs(p.date),
      description: `Client Payment via ${p.paymentMethod}`,
      amount: p.amount
    })),
    ...expenses.map((e: any) => ({
      type: 'OUT',
      date: dayjs(e.date),
      description: e.description,
      amount: e.amount
    }))
  ].sort((a, b) => a.date.valueOf() - b.date.valueOf());

  let runningBalance = 0;
  const ledgerRows = ledgerItems.map(item => {
    if (item.type === 'IN') runningBalance += item.amount;
    else runningBalance -= item.amount;
    return { ...item, runningBalance };
  });

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateProject(project._id, { status: newStatus });
      toast.success('Project status updated');
      fetchProjectAndCrew();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleAddExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await addProjectExpense(project._id, {
        date: new Date(expenseForm.date).toISOString(),
        description: expenseForm.description,
        amount: Number(expenseForm.amount)
      });
      toast.success('Expense added successfully');
      setShowExpenseModal(false);
      setExpenseForm({ date: dayjs().format('YYYY-MM-DD'), description: '', amount: '' });
      fetchProjectAndCrew();
    } catch (e) {
      toast.error('Failed to add expense');
    }
  };

  const handleAddCrew = async () => {
    if (!crewForm.role || !crewForm.charges) {
      toast.error('Please enter role and charges');
      return;
    }
    try {
      await addProjectCrew(project._id, {
        role: crewForm.role,
        charges: Number(crewForm.charges),
        assignedCrewId: crewForm.assignedCrewId || undefined
      });
      toast.success('Crew member added');
      setShowCrewModal(false);
      setCrewForm({ role: '', charges: '', assignedCrewId: '' });
      fetchProjectAndCrew();
    } catch (e) {
      toast.error('Failed to add crew member');
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project._id);
      toast.success('Project deleted');
      router.push('/projects');
    } catch (e) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </Link>
          <div>
            <h3 className="text-[32px] font-semibold text-primary tracking-tight">{project.projectNumber} - {project.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[14px] text-on-surface-variant font-medium">{project.company || project.eventType}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <select 
                value={project.status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg px-2 py-1 text-[12px] font-bold uppercase tracking-tight focus:outline-none focus:border-primary text-primary"
              >
                <option value="Lead">Lead</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Booked">Booked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors border border-red-200 bg-surface"
          title="Delete Project"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Project Details */}
        <div className="space-y-6 lg:col-span-1">
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

          <div className="glass-card p-6 rounded-[24px]">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[16px] font-semibold text-primary flex items-center gap-2">
                <Users className="w-4 h-4" /> Crew Blueprint
              </h4>
              <button 
                onClick={() => setShowCrewModal(true)}
                className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
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
                      <p className="text-[12px] text-on-surface-variant">
                        {crew.assignedCrewId ? 
                          availableCrews.find(c => c._id === crew.assignedCrewId)?.name || 'Assigned' 
                          : 'Unassigned'}
                      </p>
                    </div>
                    <span className="text-[14px] font-semibold text-primary">₹{crew.charges}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ledger */}
        <div className="space-y-6 lg:col-span-3">
          <div className="glass-card rounded-[24px] overflow-hidden">
            <div className="p-6 bg-surface-container/50 border-b border-outline-variant/20 flex justify-between items-center flex-wrap gap-4">
              <div>
                <h4 className="text-[18px] font-semibold text-primary flex items-center gap-2">
                  <Receipt className="w-5 h-5" /> Financial Ledger
                </h4>
                <p className="text-[14px] text-on-surface-variant mt-1">Project Total: <strong className="text-primary">₹{project.totalValue.toLocaleString()}</strong></p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="text-right">
                  <p className="text-[12px] text-on-surface-variant uppercase font-bold tracking-wider">Pending from Client</p>
                  <p className="text-[20px] font-bold text-secondary">₹{pendingAmount.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setShowExpenseModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-[13px] font-medium hover:bg-red-200 transition-all ml-4"
                >
                  <Plus className="w-4 h-4" /> Add Expense
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[12px] font-semibold uppercase tracking-widest text-on-surface-variant">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Income (IN)</th>
                    <th className="px-6 py-4 text-right">Expense (OUT)</th>
                    <th className="px-6 py-4 text-right">Overall Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {ledgerRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant/60">
                        No financial records found.
                      </td>
                    </tr>
                  ) : (
                    ledgerRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 text-[14px] font-medium">{row.date.format('DD MMM YYYY')}</td>
                        <td className="px-6 py-4 text-[14px] font-medium">{row.description}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${row.type === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {row.type === 'IN' ? 'RECEIVED' : 'PAID'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[14px] font-bold text-green-600 text-right">
                          {row.type === 'IN' ? `₹${row.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-[14px] font-bold text-red-600 text-right">
                          {row.type === 'OUT' ? `₹${row.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-[15px] font-bold text-primary text-right">
                          ₹{row.runningBalance.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                  {/* Summary Row */}
                  {ledgerRows.length > 0 && (
                    <tr className="bg-surface-container/30 border-t-2 border-outline-variant/40">
                      <td colSpan={3} className="px-6 py-4 text-[13px] font-bold text-right uppercase tracking-wider">Totals</td>
                      <td className="px-6 py-4 text-[15px] font-bold text-green-600 text-right">₹{totalReceived.toLocaleString()}</td>
                      <td className="px-6 py-4 text-[15px] font-bold text-red-600 text-right">₹{totalExpenses.toLocaleString()}</td>
                      <td className="px-6 py-4 text-[15px] font-bold text-primary text-right">₹{(totalReceived - totalExpenses).toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExpenseModal(false)} />
          <div className="relative w-full max-w-md bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Add Project Expense</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1 block">Date</label>
                <input 
                  type="date" 
                  value={expenseForm.date} 
                  onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}
                  className="w-full bg-transparent border border-outline-variant rounded-lg p-2 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1 block">Description (e.g., Paid to Photographer)</label>
                <input 
                  type="text" 
                  value={expenseForm.description} 
                  onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}
                  className="w-full bg-transparent border border-outline-variant rounded-lg p-2 focus:border-primary focus:outline-none"
                  placeholder="Payment description..."
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1 block">Amount (₹)</label>
                <input 
                  type="number" 
                  value={expenseForm.amount} 
                  onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})}
                  className="w-full bg-transparent border border-outline-variant rounded-lg p-2 focus:border-primary focus:outline-none"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowExpenseModal(false)}
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors font-medium text-[14px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddExpense}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:shadow-lg transition-all font-medium text-[14px]"
              >
                Save Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Crew Modal */}
      {showCrewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCrewModal(false)} />
          <div className="relative w-full max-w-md bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-semibold text-primary mb-4">Add Crew to Blueprint</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-on-surface-variant mb-2 block">Link to Existing Crew (Optional)</label>
                
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    placeholder="Search by name or location..." 
                    value={crewSearch}
                    onChange={e => setCrewSearch(e.target.value)}
                    className="flex-1 bg-transparent border border-outline-variant rounded-lg p-2 text-[13px] focus:border-primary focus:outline-none"
                  />
                  <select 
                    value={crewRoleFilter}
                    onChange={e => setCrewRoleFilter(e.target.value)}
                    className="bg-transparent border border-outline-variant rounded-lg p-2 text-[13px] focus:border-primary focus:outline-none"
                  >
                    <option value="">All Roles</option>
                    {Array.from(new Set(availableCrews.map(c => c.role))).filter(Boolean).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="border border-outline-variant/30 rounded-lg max-h-[150px] overflow-y-auto bg-surface-container-lowest custom-scrollbar mb-4">
                  {availableCrews.filter(c => {
                    const matchesSearch = c.name.toLowerCase().includes(crewSearch.toLowerCase()) || 
                                          (c.location && c.location.toLowerCase().includes(crewSearch.toLowerCase()));
                    const matchesRole = crewRoleFilter ? c.role === crewRoleFilter : true;
                    return matchesSearch && matchesRole;
                  }).length === 0 ? (
                    <div className="p-3 text-center text-[12px] text-on-surface-variant">No crew found.</div>
                  ) : (
                    availableCrews.filter(c => {
                      const matchesSearch = c.name.toLowerCase().includes(crewSearch.toLowerCase()) || 
                                            (c.location && c.location.toLowerCase().includes(crewSearch.toLowerCase()));
                      const matchesRole = crewRoleFilter ? c.role === crewRoleFilter : true;
                      return matchesSearch && matchesRole;
                    }).map(c => (
                      <div 
                        key={c._id}
                        onClick={() => {
                          if (crewForm.assignedCrewId === c._id) {
                            setCrewForm({ ...crewForm, assignedCrewId: '' });
                          } else {
                            setCrewForm({
                              ...crewForm,
                              assignedCrewId: c._id,
                              role: c.role || '',
                              charges: c.charges?.toString() || ''
                            });
                          }
                        }}
                        className={`p-3 border-b border-outline-variant/10 cursor-pointer flex justify-between items-center transition-colors ${crewForm.assignedCrewId === c._id ? 'bg-primary/10 border-l-2 border-l-primary' : 'hover:bg-primary/5'}`}
                      >
                        <div>
                          <p className="text-[13px] font-medium text-on-surface">{c.name}</p>
                          <p className="text-[11px] text-on-surface-variant">{c.role} • {c.location}</p>
                        </div>
                        <div className="text-[12px] font-semibold text-primary">
                          ₹{c.charges}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1 block">Role (e.g., Lead Photographer)</label>
                <input 
                  type="text" 
                  value={crewForm.role} 
                  onChange={e => setCrewForm({...crewForm, role: e.target.value})}
                  className="w-full bg-transparent border border-outline-variant rounded-lg p-2 focus:border-primary focus:outline-none"
                  placeholder="Role..."
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-on-surface-variant mb-1 block">Charges (₹)</label>
                <input 
                  type="number" 
                  value={crewForm.charges} 
                  onChange={e => setCrewForm({...crewForm, charges: e.target.value})}
                  className="w-full bg-transparent border border-outline-variant rounded-lg p-2 focus:border-primary focus:outline-none"
                  placeholder="e.g. 15000"
                />
              </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowCrewModal(false)}
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors font-medium text-[14px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCrew}
                className="px-6 py-2 rounded-xl bg-primary text-white hover:shadow-lg transition-all font-medium text-[14px]"
              >
                Add Crew
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-md bg-surface border border-outline-variant/30 rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Delete Project</h3>
            <p className="text-[14px] text-on-surface-variant mb-8">
              Are you sure you want to delete this project? This will permanently remove it from the system. (Linked payments and quotations will not be deleted but will lose their project association).
            </p>
            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-xl text-on-surface-variant bg-surface-variant/50 hover:bg-surface-variant transition-colors font-medium text-[14px]"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteProject}
                className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transition-all font-medium text-[14px]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
