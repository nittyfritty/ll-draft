import { Document, Schema, model, Types } from "mongoose";
import type { EvaluationScore } from "./Evaluation.js";

export type PlayerList = {
  _id: Types.ObjectId;
  name: string;
  birthDate: Date;
  leagueAge: number;
  actualAge: number;
  coachId: Types.ObjectId | null;
  division: string;
  evaluationScore?: EvaluationScore;
};

export interface ICoach extends Document {
  name: string;
  email: string;
  phone?: string;
  teamName?: string;
  division: string;
  nameDisplay?: string;
  playerlist?: PlayerList[];
  createdAt: Date;
  updatedAt: Date;
}

const coachSchema = new Schema<ICoach>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, },
    teamName: { type: String },
    division: { type: String, required: true, enum: ["T-Ball U4", "T-Ball U6", "A", "AA","AAA","Majors"] },
    nameDisplay: { type: String },
    playerlist: [
      {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        birthDate: { type: Date, required: true },
        leagueAge: { type: Number, required: true },
        actualAge: { type: Number, required: true },
        coachId: { type: Types.ObjectId, ref: "Coach", default: null },
        division: { type: String, required: true },
        evaluationScore: {
          type: [Schema.Types.Mixed],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

(coachSchema as any).pre("save", function (this: ICoach, next: (err?: Error) => void) {
  if (!this.nameDisplay) {
    this.nameDisplay = `${this.name} - ${this.division}`;
  }
  next();
});

const Coaches = model<ICoach>("Coach", coachSchema);

export default Coaches;