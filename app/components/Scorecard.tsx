"use client";

import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreResponse } from "@/app/types/scorecard";
import { motion } from "framer-motion";

interface ScorecardProps {
  score: ScoreResponse;
  onClose: () => void;
}

export const Scorecard = ({ score, onClose }: ScorecardProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const chartData = [
    {
      name: "Problem\nClarity",
      score: score.problemClarity,
      fullMark: 10,
    },
    {
      name: "Market\nSize",
      score: score.marketSize,
      fullMark: 10,
    },
    {
      name: "Solution\nUniqueness",
      score: score.solutionUniqueness,
      fullMark: 10,
    },
    {
      name: "Monetization",
      score: score.monetization,
      fullMark: 10,
    },
    {
      name: "Storytelling",
      score: score.storytelling,
      fullMark: 10,
    },
  ];

  const overallScore = Math.round(
    (score.problemClarity +
      score.marketSize +
      score.solutionUniqueness +
      score.monetization +
      score.storytelling) /
      5
  );

  const downloadPDF = () => {
    setIsDownloading(true);
    // Simple text-based download for now
    const content = `PITCH SCORECARD
================

Overall Score: ${overallScore}/10

Dimensions:
- Problem Clarity: ${score.problemClarity}/10
- Market Size: ${score.marketSize}/10
- Solution Uniqueness: ${score.solutionUniqueness}/10
- Monetization: ${score.monetization}/10
- Storytelling: ${score.storytelling}/10

Summary:
${score.summary}

Detailed Feedback:
- Problem Clarity: ${score.feedback.problemClarity}
- Market Size: ${score.feedback.marketSize}
- Solution Uniqueness: ${score.feedback.solutionUniqueness}
- Monetization: ${score.feedback.monetization}
- Storytelling: ${score.feedback.storytelling}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pitch-scorecard-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setIsDownloading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-neutral-950 border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10 bg-neutral-950">
          <h2 className="font-bebas text-2xl text-white">PITCH SCORECARD</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Overall Score */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-baseline gap-1">
              <span className="font-bebas text-6xl text-yellow-400">
                {overallScore}
              </span>
              <span className="font-mono text-xl text-neutral-500">/10</span>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
              Overall Score
            </p>
          </div>

          {/* Radar Chart */}
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={chartData}
                margin={{ top: 20, right: 80, left: 20, bottom: 60 }}
              >
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#a3a3a3", fontSize: 11 }}
                  tickLine={{ stroke: "#ffffff10" }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 10]}
                  tick={{ fill: "#727272", fontSize: 10 }}
                  tickLine={{ stroke: "#ffffff10" }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  fillOpacity={0.25}
                  dot={{ fill: "#fbbf24", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "#fbbf24" }}
                  formatter={(value) => `${value}/10`}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-yellow-400">
              Summary
            </h3>
            <p className="font-mono text-sm text-neutral-300 leading-relaxed">
              {score.summary}
            </p>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-3">
            <h3 className="font-mono text-xs uppercase tracking-widest text-yellow-400">
              Detailed Feedback
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Problem Clarity",
                  score: score.problemClarity,
                  feedback: score.feedback.problemClarity,
                },
                {
                  label: "Market Size",
                  score: score.marketSize,
                  feedback: score.feedback.marketSize,
                },
                {
                  label: "Solution Uniqueness",
                  score: score.solutionUniqueness,
                  feedback: score.feedback.solutionUniqueness,
                },
                {
                  label: "Monetization",
                  score: score.monetization,
                  feedback: score.feedback.monetization,
                },
                {
                  label: "Storytelling",
                  score: score.storytelling,
                  feedback: score.feedback.storytelling,
                },
              ].map((dimension) => (
                <div key={dimension.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-neutral-400">
                      {dimension.label}
                    </span>
                    <span className="font-bebas text-lg text-yellow-400">
                      {dimension.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-neutral-900 rounded-full h-2">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                      style={{
                        width: `${(dimension.score / 10) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="font-mono text-xs text-neutral-500">
                    {dimension.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="flex-1 font-bebas text-sm gap-2 bg-yellow-400 text-black hover:bg-yellow-300"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 font-bebas text-sm bg-neutral-900 text-white border border-white/10 hover:bg-neutral-800"
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
