import mongoose, { Schema, Document } from 'mongoose';

interface ServiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IQuotation extends Document {
  customerName: string;
  phone: string;
  email: string;
  location: string;
  bookingDate: Date;
  eventType: string;
  services: ServiceItem[];
  discount: number;
  subTotal: number;
  grandTotal: number;
  paymentTerms: string;
  termsConditions: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
});

const QuotationSchema: Schema = new Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  eventType: { type: String, required: true },
  services: [ServiceItemSchema],
  discount: { type: Number, default: 0 },
  subTotal: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  paymentTerms: { type: String },
  termsConditions: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', QuotationSchema);
