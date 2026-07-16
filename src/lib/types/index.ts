export type Role = 'admin' | 'staff' | 'viewer';

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Quotation {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  location: string;
  bookingDate: string;
  eventType: string;
  services: ServiceItem[];
  discount: number;
  gst: number;
  subTotal: number;
  grandTotal: number;
  paymentTerms: string;
  termsConditions: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod = 'UPI QR' | 'UPI ID' | 'Bank Transfer';
export type PaymentStatus = 'Pending Verification' | 'Verified' | 'Rejected' | 'PAID' | 'PENDING';

export interface Payment {
  _id?: string;
  id: string;
  customerId: string; // or customerName if simple
  customerName: string;
  phone: string;
  quotationId?: string;
  bookingId?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  screenshotUrl: string;
  status: PaymentStatus;
  date: string;
  remarks?: string;
}

export type BookingStatus = 'Upcoming' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  client: string;
  date: string;
  venue: string;
  photographers: string[]; // ids
  videographers: string[]; // ids
  package: string;
  advancePaid: number;
  pending: number;
  status: BookingStatus;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  location: string;
  eventType: string;
  leadSource: string;
  status: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  experience: string;
  camera: string;
  location: string;
  dailyCharge: number;
  availability: 'Available' | 'Busy';
  notes: string;
  rating: number;
  portfolioLink: string;
  status: 'Active' | 'Inactive';
}

export interface Photographer extends Staff {
  specialization: string;
  drone: boolean;
}

export interface Videographer extends Staff {
  editingSoftware: string;
}
