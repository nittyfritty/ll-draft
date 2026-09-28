import { Document, Schema, model } from "mongoose";

export interface IPlayer extends Document {
  name: string;
  birthDate: Date;
  leagueAge: number;
  actualAge: number;
  parentNameOne: string;
  parentNameTwo?: string;
  parentEmailOne: string;
  parentEmailTwo?: string;
  parentPhoneOne: string;
  parentPhoneTwo?: string;
  coachId: Schema.Types.ObjectId | null;
  division: string;
  evaluationScore?: Array<[string, number]>;
  createdAt: Date;
  updatedAt: Date;
}

const playerSchema = new Schema<IPlayer>(
  {
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    leagueAge: { type: Number, required: true },
    actualAge: { type: Number, required: true },
    parentNameOne: { type: String, required: true },
    parentNameTwo: { type: String },
    parentEmailOne: { type: String, required: true },
    parentEmailTwo: { type: String },
    parentPhoneOne: { type: String, required: true },
    parentPhoneTwo: { type: String },
    coachId: { type: Schema.Types.ObjectId, ref: "Coach", default: null },
    division: { type: String, required: true },
    evaluationScore: {
      type: [[String, Number]],
      default: [],
    },
  },
  { timestamps: true }
);

const Players = model<IPlayer>("Player", playerSchema);

export default Players;