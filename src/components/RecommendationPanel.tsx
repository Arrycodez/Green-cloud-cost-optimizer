import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingDown, 
  Zap, 
  Globe, 
  CheckCircle2, 
  ArrowUpRight,
  AlertCircle,
  Info
} from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  savings: string;
  icon: React.ElementType;
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Reduce Instance Size',
    description: 'Your t3.large instance is consistently under 20% CPU. Downsizing to t3.medium can save 50% on costs.',
    impact: 'high',
    savings: '$45.20/mo',
    icon: TrendingDown
  },
  {
    id: '2',
    title: 'Enable Auto-Scaling',
    description: 'Traffic spikes detected between 2 PM and 6 PM. Auto-scaling will prevent over-provisioning during off-peak hours.',
    impact: 'medium',
    savings: '$12.50/mo',
    icon: Zap
  },
  {
    id: '3',
    title: 'Shift to Low-Carbon Region',
    description: 'Moving non-critical batch jobs to us-west-2 (Oregon) will reduce your carbon footprint by 40%.',
    impact: 'high',
    savings: '120kg CO2/mo',
    icon: Globe
  },
  {
    id: '4',
    title: 'S3 Intelligent-Tiering',
    description: 'Automate storage cost optimization for infrequently accessed data in your S3 buckets.',
    impact: 'low',
    savings: '$5.00/mo',
    icon: Info
  }
];

const impactColors = {
  low: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  medium: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  high: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
};

export default function RecommendationPanel() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          Neural Recommendations
        </h3>
        <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">4 Actions Available</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {suggestions.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            className="glass-card p-5 border-white/5 hover:border-emerald-500/30 transition-colors group relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="flex gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                <item.icon className="w-6 h-6 text-emerald-400" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${impactColors[item.impact]}`}>
                    {item.impact} Impact
                  </div>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Est. Savings:</span>
                    <span className="text-sm font-bold text-emerald-400">{item.savings}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                    Apply Now
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
