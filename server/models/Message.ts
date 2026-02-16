
import mongoose, { Schema, Document } from 'mongoose';
import { SoftDeleteFields } from './BaseSchema';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  date: Date;
  status: string;
  replies: any[];
  deletedAt: Date | null;
}

const MessageSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'new' },
  replies: [{
    adminName: String,
    text: String,
    timestamp: { type: Date, default: Date.now },
    deliveryStatus: String
  }],
  ...SoftDeleteFields
});

export default mongoose.model<IMessage>('Message', MessageSchema);
