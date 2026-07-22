'use server';

import connectToDatabase from '@/lib/mongoose';
import { revalidatePath } from 'next/cache';
import Project from '@/lib/models/Project';
import Payment from '@/lib/models/Payment';
import Quotation from '@/lib/models/Quotation';
import Booking from '@/lib/models/Booking';
import Crew from '@/lib/models/Crew';
import EventType from '@/lib/models/EventType';

export async function getEventTypes() {
  await connectToDatabase();
  const types = await EventType.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(types));
}

export async function createEventType(name: string) {
  await connectToDatabase();
  try {
    const type = await EventType.create({ name });
    return JSON.parse(JSON.stringify(type));
  } catch (e) {
    // Return existing if duplicate
    const existing = await EventType.findOne({ name }).lean();
    if (existing) return JSON.parse(JSON.stringify(existing));
    throw e;
  }
}

export async function getProjects() {
  await connectToDatabase();
  const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectById(id: string) {
  await connectToDatabase();
  const project = await Project.findById(id).lean() as any;
  if (!project) return null;
  
  project.quotationsList = await Quotation.find({ projectId: id }).sort({ createdAt: -1 }).lean();
  project.paymentsList = await Payment.find({ projectId: id }).sort({ date: -1 }).lean();
  
  return JSON.parse(JSON.stringify(project));
}

export async function createProject(data: any) {
  await connectToDatabase();
  
  // Generate a random 6-character alphanumeric string for projectNumber
  const projectNumber = 'PRJ-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const projectData = { ...data, projectNumber };
  
  const project = await Project.create(projectData);
  revalidatePath('/projects', 'layout');
  return JSON.parse(JSON.stringify(project));
}

export async function updateProject(id: string, data: any) {
  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/projects', 'layout');
  return JSON.parse(JSON.stringify(project));
}

export async function deleteProject(id: string) {
  await connectToDatabase();
  await Project.findByIdAndDelete(id);
  revalidatePath('/projects', 'layout');
  return { success: true };
}

export async function getPayments() {
  await connectToDatabase();
  const payments = await Payment.find({}).sort({ date: -1 }).lean();
  return JSON.parse(JSON.stringify(payments));
}

export async function createPayment(data: any) {
  await connectToDatabase();
  const payment = await Payment.create(data);
  return JSON.parse(JSON.stringify(payment));
}

export async function verifyPayment(id: string, projectId?: string) {
  await connectToDatabase();
  const updateData: any = { status: 'PAID' };
  if (projectId) {
    updateData.projectId = projectId;
  }
  const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
  
  if (projectId) {
    // Add payment to project's payments array
    await Project.findByIdAndUpdate(projectId, { $addToSet: { payments: id } });
  }
  
  return JSON.parse(JSON.stringify(payment));
}

export async function addProjectExpense(projectId: string, expense: { date: string, description: string, amount: number }) {
  await connectToDatabase();
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $push: { expenses: expense } },
    { new: true }
  );
  revalidatePath('/projects', 'layout');
  return JSON.parse(JSON.stringify(project));
}

export async function addProjectCrew(projectId: string, crewData: { role: string, assignedCrewId?: string, charges: number }) {
  await connectToDatabase();
  const updateQuery: any = { $push: { crewBlueprint: crewData } };
  
  if (crewData.charges && crewData.charges > 0) {
    updateQuery.$push.expenses = {
      date: new Date().toISOString(),
      description: `Crew Assigned: ${crewData.role}`,
      amount: crewData.charges
    };
  }

  const project = await Project.findByIdAndUpdate(
    projectId,
    updateQuery,
    { new: true }
  );
  revalidatePath('/projects', 'layout');
  return JSON.parse(JSON.stringify(project));
}

export async function deletePayment(id: string) {
  await connectToDatabase();
  await Payment.findByIdAndDelete(id);
  return { success: true };
}

export async function getQuotations() {
  await connectToDatabase();
  const quotations = await Quotation.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(quotations));
}

export async function createQuotation(data: any) {
  await connectToDatabase();
  const quotation = await Quotation.create(data);
  revalidatePath('/quotations', 'layout');
  return JSON.parse(JSON.stringify(quotation));
}

export async function getQuotationById(id: string) {
  await connectToDatabase();
  const quotation = await Quotation.findById(id).lean();
  return JSON.parse(JSON.stringify(quotation));
}

export async function updateQuotation(id: string, data: any) {
  await connectToDatabase();
  const quotation = await Quotation.findByIdAndUpdate(id, data, { new: true });
  revalidatePath('/quotations', 'layout');
  return JSON.parse(JSON.stringify(quotation));
}

export async function deleteQuotation(id: string) {
  await connectToDatabase();
  await Quotation.findByIdAndDelete(id);
  revalidatePath('/quotations', 'layout');
  return { success: true };
}

export async function getBookings() {
  await connectToDatabase();
  const bookings = await Booking.find({}).sort({ date: 1 }).lean();
  return JSON.parse(JSON.stringify(bookings));
}

export async function getDashboardStats() {
  await connectToDatabase();
  const totalRevenueAgg = await Payment.aggregate([
    { $match: { status: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const revenue = totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

  const pendingPaymentsAgg = await Payment.aggregate([
    { $match: { status: 'PENDING' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const unverifiedPaymentsAmount = pendingPaymentsAgg.length > 0 ? pendingPaymentsAgg[0].total : 0;
  
  const totalProjectValueAgg = await Project.aggregate([
    { $group: { _id: null, total: { $sum: '$totalValue' } } }
  ]);
  const totalProjectValue = totalProjectValueAgg.length > 0 ? totalProjectValueAgg[0].total : 0;
  
  // New logic: pending amount is total project value minus total revenue
  const pendingPaymentsAmount = Math.max(0, totalProjectValue - revenue);
  
  const totalBookings = await Booking.countDocuments();
  const totalQuotations = await Quotation.countDocuments();
  const totalProjects = await Project.countDocuments();
  const finishedProjects = await Project.countDocuments({ status: 'Completed' });

  return {
    totalQuotations,
    totalBookings,
    pendingPaymentsAmount,
    revenue,
    totalProjects,
    finishedProjects
  };
}

export async function getCrew() {
  await connectToDatabase();
  const crew = await Crew.find({}).sort({ location: 1, name: 1 }).lean();
  return JSON.parse(JSON.stringify(crew));
}

export async function createCrew(data: any) {
  await connectToDatabase();
  const crew = await Crew.create(data);
  return JSON.parse(JSON.stringify(crew));
}

export async function updateCrew(id: string, data: any) {
  await connectToDatabase();
  const crew = await Crew.findByIdAndUpdate(id, data, { new: true });
  return JSON.parse(JSON.stringify(crew));
}

export async function deleteCrew(id: string) {
  await connectToDatabase();
  await Crew.findByIdAndDelete(id);
  return { success: true };
}
