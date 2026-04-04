import React, { useState } from 'react';
import { 
  Zap, 
  TrendingDown, 
  Globe, 
  Server, 
  Activity, 
  Cpu, 
  Database,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const chartData = [
  { name: 'Mon', current: 400, optimized: 240 },
  { name: 'Tue', current: 300, optimized: 198 },
  { name: 'Wed', current: 500, optimized: 310 },
  { name: 'Thu', current: 280, optimized: 150 },
  { name: 'Fri', current: 590, optimized: 380 },
  { name: 'Sat', current: 320, optimized: 210 },
  { name: 'Sun', current: 440, optimized: 290 },
];

const comparisonData = [
  { name: 'Cost ($)', current: 12450, optimized: 8120, color: '#3b82f6' },
  { name: 'Carbon (kg)', current: 2400, optimized: 1150, color: '#10b981' },
];

import RecommendationPanel from '../components/RecommendationPanel';

export default function OptimizationDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    current_type: 't3.large',
    avg_cpu: '45',
    avg_mem: '128',
    rps: '1000',
    region: 'us-east-1'
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);

    try {
      // API Call to Flask Backend
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_type: formData.current_type,
          avg_cpu: parseFloat(formData.avg_cpu),
          avg_mem: parseFloat(formData.avg_mem),
          rps: parseFloat(formData.rps),
          region: formData.region
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('Optimization failed:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Fallback for demo purposes if backend isn't running
      // setResults(mockData); 
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const comparisonData = results ? [
    { 
      name: 'Monthly Cost ($)', 
      current: results.optimization.current_monthly_cost, 
      optimized: results.optimization.optimized_monthly_cost 
    },
    { 
      name: 'Carbon (kg CO2)', 
      current: results.carbon.current_emissions_kg, 
      optimized: results.carbon.optimized_emissions_kg 
    },
  ] : [];

  const dynamicChartData = results ? chartData.map(d => ({
    ...d,
    current: d.current * (parseFloat(formData.avg_cpu) / 50),
    optimized: d.optimized * (parseFloat(formData.avg_cpu) / 50) * (results.optimization.optimized_monthly_cost / results.optimization.current_monthly_cost)
  })) : chartData;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight neon-text-emerald">Neural Optimizer</h2>
          <p className="text-slate-400 mt-1 text-sm md:text-base">AI-driven infrastructure right-sizing & carbon reduction.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 md:px-4 py-1.5 md:py-2 glass-card border-emerald-500/30 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono text-emerald-400 uppercase tracking-widest">System Online</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-4 md:p-6 border-white/5 space-y-4 md:space-y-6 h-full"
          >
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-base md:text-lg">Workload Parameters</h3>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">Instance Type</label>
                <select 
                  name="current_type"
                  value={formData.current_type}
                  onChange={handleInputChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 md:py-3 px-4 focus:outline-none focus:border-blue-500/50 transition-colors text-sm appearance-none"
                >
                  <option value="t3.nano">t3.nano</option>
                  <option value="t3.micro">t3.micro</option>
                  <option value="t3.small">t3.small</option>
                  <option value="t3.medium">t3.medium</option>
                  <option value="t3.large">t3.large</option>
                  <option value="m5.large">m5.large</option>
                  <option value="m5.xlarge">m5.xlarge</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">Avg CPU Load (%)</label>
                  <div className="relative">
                    <Cpu className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="avg_cpu"
                      type="number" 
                      value={formData.avg_cpu}
                      onChange={handleInputChange}
                      placeholder="e.g. 45"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 md:py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">Memory Usage (%)</label>
                  <div className="relative">
                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="avg_mem"
                      type="number" 
                      value={formData.avg_mem}
                      onChange={handleInputChange}
                      placeholder="e.g. 60"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 md:py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">Traffic (RPS)</label>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="rps"
                      type="number" 
                      value={formData.rps}
                      onChange={handleInputChange}
                      placeholder="e.g. 500"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 md:py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wider">Region</label>
                  <select 
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 md:py-3 px-4 focus:outline-none focus:border-blue-500/50 transition-colors text-sm appearance-none"
                  >
                    <option value="us-east-1">US East (N. Virginia)</option>
                    <option value="us-west-2">US West (Oregon)</option>
                    <option value="eu-west-1">Europe (Ireland)</option>
                    <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    <option value="ca-central-1">Canada (Central)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isAnalyzing}
                className={`w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 active:scale-95 ${isAnalyzing ? 'shimmer' : ''}`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Run Optimization
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[300px] md:min-h-[400px] glass-card border-dashed border-white/10 flex flex-col items-center justify-center p-6 md:p-12 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-500">Ready to Optimize</h3>
                <p className="text-slate-600 max-w-xs mx-auto text-sm">
                  Enter your workload parameters and click "Run Optimization" to see how you can save costs and reduce carbon emissions.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Impact Cards using real data */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass-card p-4 md:p-5 border-blue-500/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <TrendingDown className="w-5 h-5 text-blue-400 mb-2 md:mb-3" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Monthly Savings</p>
                    <h4 className="text-xl md:text-2xl font-bold text-white mt-1">
                      ${results.optimization.monthly_savings_usd}
                    </h4>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass-card p-4 md:p-5 border-emerald-500/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Globe className="w-5 h-5 text-emerald-400 mb-2 md:mb-3" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Carbon Reduction</p>
                    <h4 className="text-xl md:text-2xl font-bold text-white mt-1">
                      {results.carbon.reduction_kg}kg CO2
                    </h4>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass-card p-4 md:p-5 border-purple-500/20 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Zap className="w-5 h-5 text-purple-400 mb-2 md:mb-3" />
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Recommended</p>
                    <h4 className="text-lg md:text-xl font-bold text-white mt-1 uppercase tracking-tighter">
                      {results.optimization.recommended_type}
                    </h4>
                  </motion.div>
                </div>

                {/* Charts and Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="glass-card p-4 md:p-6">
                    <h3 className="text-xs md:text-sm font-bold mb-4 md:mb-6 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      Usage Projection
                    </h3>
                    <div className="h-48 md:h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dynamicChartData}>
                          <defs>
                            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                          <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            itemStyle={{ fontSize: '12px' }}
                          />
                          <Area type="monotone" dataKey="current" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCurrent)" strokeWidth={2} />
                          <Area type="monotone" dataKey="optimized" stroke="#10b981" fillOpacity={1} fill="url(#colorOptimized)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-4 md:p-6">
                    <h3 className="text-xs md:text-sm font-bold mb-4 md:mb-6 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      Impact Comparison
                    </h3>
                    <div className="h-48 md:h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={comparisonData} layout="vertical" barSize={20}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} width={80} />
                          <Tooltip 
                            cursor={{ fill: '#ffffff05' }}
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                          />
                          <Bar dataKey="current" fill="#ffffff10" radius={[0, 4, 4, 0]} />
                          <Bar dataKey="optimized" fill="#10b981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card p-4 md:p-6"
                >
                  <RecommendationPanel />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
