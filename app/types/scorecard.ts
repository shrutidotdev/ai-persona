export interface ScoreDimension {
  name: string;
  score: number;
  feedback: string;
  fullName: string;
}

export interface PitchScorecard {
  dimensions: ScoreDimension[];
  overallScore: number;
  summary: string;
  timestamp: string;
}

export interface ScoreResponse {
  problemClarity: number;
  marketSize: number;
  solutionUniqueness: number;
  monetization: number;
  storytelling: number;
  summary: string;
  feedback: {
    problemClarity: string;
    marketSize: string;
    solutionUniqueness: string;
    monetization: string;
    storytelling: string;
  };
}
