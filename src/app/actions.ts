'use server';

import connectToDatabase from '@/lib/mongoose';
import Contact from '@/lib/models/Contact';
import Payment from '@/lib/models/Payment';
import Quotation from '@/lib/models/Quotation';
import Booking from '@/lib/models/Booking';
import Crew from '@/lib/models/Crew';

export async function getContacts() {
  await connectToDatabase();
  const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(contacts));
}

export async function createContact(data: any) {
  await connectToDatabase();
  const contact = await Contact.create(data);
  return JSON.parse(JSON.stringify(contact));
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

export async function getQuotations() {
  await connectToDatabase();
  const quotations = await Quotation.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(quotations));
}

export async function createQuotation(data: any) {
  await connectToDatabase();
  const quotation = await Quotation.create(data);
  return JSON.parse(JSON.stringify(quotation));
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
  const pendingPaymentsAmount = pendingPaymentsAgg.length > 0 ? pendingPaymentsAgg[0].total : 0;
  
  const totalBookings = await Booking.countDocuments();
  const totalQuotations = await Quotation.countDocuments();
  const totalContacts = await Contact.countDocuments();

  return {
    totalQuotations,
    totalBookings,
    pendingPaymentsAmount,
    revenue,
    totalContacts
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
