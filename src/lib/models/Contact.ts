import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
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
  createdAt: Date;
}

const ContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  company: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  eventType: { type: String, required: true },
  leadSource: { type: String, required: true },
  status: { type: String, required: true },
  notes: { type: String },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
