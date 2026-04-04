import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  TrendingDown, 
  Globe, 
  Activity,
  ShieldCheck
} from 'lucide-react';

interface AutomationStatusProps {
  activeRules: number;
  totalSavings: string;
  carbonReduced: string;
  lastAction: string;
}

export default function AutomationStatus({ activeRules, totalSavings, carbonReduced, lastAction }: AutomationStatusProps) {
  const stats = [
    { label: 'Active Rules', value: activeRules, icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Saved', value: totalSavings, icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'CO2 Reduced', value: carbonReduced, icon: Globe, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Last Action', value: lastAction, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
          className="glass-card p-4 md:p-5 border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 group relative overflow-hidden"
        >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${stat.bg}`} />
          <div className={`p-3 rounded-xl relative z-10 ${stat.bg} shrink-0`}>
            <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
          </div>
          <div className="relative z-10 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold truncate">{stat.label}</p>
            <h4 className="text-base md:text-xl font-bold text-white mt-0.5 truncate">{stat.value}</h4>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
