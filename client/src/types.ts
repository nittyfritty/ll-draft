export type ObjectId = string;

export type EvaluationSkill = "Batting" | "Fielding" | "Throwing";

export type EvaluationEntry = [EvaluationSkill, number | null];


export interface Player {
  _id: ObjectId;
  name: string;
  birthDate: string;
  leagueAge: number;
  actualAge: number;
  parentNameOne: string;
  parentNameTwo?: string;
  parentEmailOne: string;
  parentEmailTwo?: string;
  parentPhoneOne: string;
  parentPhoneTwo?: string;
  coachId: string | null;
  division: string;
  evaluationScore?: EvaluationEntry[];
}

export type PlayerSummary = Pick<
  Player,
  | "_id"
  | "name"
  | "evaluationScore"
  | "coachId"
  | "division"
  | "leagueAge"
  | "actualAge"
>;

export interface Coach {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  teamName: string;
  division: string;
  nameDisplay?: string;
  playerlist?: PlayerSummary[];
  playerCount: number;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: ValidationFieldError[];
}
export interface ValidationFieldError {
  field: string;
  msg: string;
}