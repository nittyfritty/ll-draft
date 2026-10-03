export const evaluationSkills = ["Batting", "Fielding", "Throwing"] as const;

export type EvaluationSkill = (typeof evaluationSkills)[number];
export type EvaluationEntry = [skill: EvaluationSkill, score: number | null];
export type EvaluationScore = EvaluationEntry[];