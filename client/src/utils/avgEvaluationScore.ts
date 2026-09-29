import type { EvaluationEntry } from "../types";

// Function averages the 3 scores in the evaluationScore array and returns the average score.  Only take the average of actual numbers, if a value is NaN then skip it.  If all values are NaN then return NaN.
export function averageEvaluationScore(evaluationScore: EvaluationEntry[]): number {
  if (!evaluationScore || evaluationScore.length === 0) {
    return NaN;
  }

  const validScores = evaluationScore
    .map(([, score]) => score)
    .filter((score): score is number => score !== null && !Number.isNaN(score));
  if (validScores.length === 0) {
    return NaN;
  }

  const sum = validScores.reduce((acc, score) => acc + score, 0);
  return sum / validScores.length;
}