import mongoose, { Schema, Document } from 'mongoose';

interface CrewBlueprintItem {
  role: string;
  assignedCrewId?: string;
  charges?: number;
}

export interface IProject extends Document {
  name: string;
  company?: string;
  phone: string;
  email: string;
  location: string;
  eventType: string;
  eventDate?: Date;
  status: string;
  notes?: string;
  
  quotations: string[];
  payments: string[];
  crewBlueprint: CrewBlueprintItem[];
  bookingId?: string;
  
  createdAt: Date;
}

const CrewBlueprintSchema = new Schema({
  role: { type: String, required: true },
  assignedCrewId: { type: String },
  charges: { type: Number, default: 0 }
});

const ProjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  company: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date },
  status: { type: String, required: true, default: 'Lead' },
  notes: { type: String },
  
  quotations: [{ type: Schema.Types.ObjectId, ref: 'Quotation' }],
  payments: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
  crewBlueprint: [CrewBlueprintSchema],
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  
  createdAt: { type: Date, default: Date.now },
});

delete mongoose.models.Project;
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
