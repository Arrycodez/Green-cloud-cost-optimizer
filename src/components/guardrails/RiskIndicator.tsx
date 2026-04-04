import React from 'react';
import { motion } from 'motion/react';

interface RiskIndicatorProps {
  level: 'Low' | 'Medium' | 'High';
  score: number;
}

export default function RiskIndicator({ level, score }: RiskIndicatorProps) {
  const getColor = () => {
    if (level === 'Low') return 'text-emerald-400';
    if (level === 'Medium') return 'text-amber-400';
    return 'text-red-400';
  };

  const getBgColor = () => {
    if (level === 'Low') return 'bg-emerald-500';
    if (level === 'Medium') return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="glass-card p-6 border-white/5 flex flex-col items-center text-center">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">System Risk Level</h3>
      
      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
          />
          <motion.circle
            cx="64"
            cy="64"
            r="58"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="364.4"
            initial={{ strokeDashoffset: 364.4 }}
            animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={getColor()}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${getColor()}`}>{level}</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Risk Score</span>
        </div>
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Safety Threshold</span>
          <span>{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            className={`h-full ${getBgColor()}`}
          />
        </div>
      </div>
    </div>
  );
}
