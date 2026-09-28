import { Document, Schema, model } from "mongoose";

export interface ICoach extends Document {
  name: string;
  email: string;
  phone: string;
  teamName: string;
  division: string;
  createdAt: Date;
  updatedAt: Date;
}

const coachSchema = new Schema<ICoach>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, },
    teamName: { type: String },
    division: { type: String, required: true },
  },
  { timestamps: true }
);

const Coaches = model<ICoach>("Coach", coachSchema);

export default Coaches;