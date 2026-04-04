import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  TrendingDown, 
  Globe, 
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Info,
  DollarSign,
  Zap,
  Settings,
  Bell
} from 'lucide-react';
import RiskIndicator from '../components/guardrails/RiskIndicator';
import AlertsPanel from '../components/guardrails/AlertsPanel';

interface Limits {
  max_budget: number;
  max_cpu: number;
  max_carbon: number;
}

interface RiskStatus {
  risk_level: 'Low' | 'Medium' | 'High';
  risk_score: number;
  metrics: {
    budget: number;
    cpu: number;
    carbon: number;
  };
}

interface Alert {
  type: 'budget' | 'cpu' | 'carbon';
  message: string;
  severity: 'warning' | 'critical';
  timestamp: string;
}

export default function Guardrails() {
  const [limits, setLimits] = useState<Limits>({
    max_budget: 5000,
    max_cpu: 80,
    max_carbon: 500
  });
  const [status, setStatus] = useState<RiskStatus | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [limitsRes, statusRes, alertsRes] = await Promise.all([
        fetch('/api/config/get'), // Reuse config for limits or create new endpoint
        fetch('/api/guardrails/status'),
        fetch('/api/guardrails/alerts')
      ]);
      
      if (!limitsRes.ok || !statusRes.ok || !alertsRes.ok) throw new Error('Failed to fetch guardrail data');
      
      const limitsData = await limitsRes.json();
      const statusData = await statusRes.json();
      const alertsData = await alertsRes.json();
      
      // If limitsData doesn't have guardrail fields, use defaults
      setLimits({
        max_budget: limitsData.max_budget || 5000,
        max_cpu: limitsData.max_cpu || 80,
        max_carbon: limitsData.max_carbon || 500
      });
      setStatus(statusData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateLimit = async (key: keyof Limits, value: number) => {
    const newLimits = { ...limits, [key]: value };
    setLimits(newLimits);
    setIsUpdating(true);
    try {
      const res = await fetch('/api/guardrails/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLimits)
      });
      if (!res.ok) throw new Error('Failed to update limits');
      
      // Refresh status and alerts
      const [statusRes, alertsRes] = await Promise.all([
        fetch('/api/guardrails/status'),
        fetch('/api/guardrails/alerts')
      ]);
      if (statusRes.ok) setStatus(await statusRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismissAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

  if (isLoading && !status) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="h-8 md:h-10 w-32 md:w-48 bg-white/5 rounded-lg shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="h-64 md:h-96 bg-white/5 rounded-2xl shimmer" />
          <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight neon-text-blue">System Guardrails</h2>
          <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm md:text-base">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            Enforce operational limits and safety thresholds.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 glass-card border-white/10 hover:border-blue-500/30 transition-all group"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-blue-400 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
          <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest">
            Guardrails Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Risk & Alerts */}
        <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
          {status && <RiskIndicator level={status.risk_level} score={status.risk_score} />}
          <AlertsPanel alerts={alerts} onDismiss={handleDismissAlert} />
        </div>

        {/* Right Column: Limits Configuration */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8 order-1 lg:order-2">
          <div className="glass-card p-4 md:p-8 border-white/5">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h3 className="text-xs md:text-sm font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                Operational Limits
              </h3>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest hidden sm:inline">Real-time Enforcement</span>
            </div>

            <div className="space-y-8 md:space-y-10">
              {/* Monthly Budget Limit */}
              <div className="space-y-4">
                <div className="flex justify-between items-end gap-4">
                  <div className="min-w-0">
                    <label className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">Max Monthly Budget</span>
                    </label>
                    <p className="text-xs text-slate-500 hidden sm:block">System will trigger critical alerts when budget exceeds this value.</p>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-white tracking-tight shrink-0">${limits.max_budget}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="100"
                  value={limits.max_budget}
                  onChange={(e) => handleUpdateLimit('max_budget', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                  <span>$500</span>
                  <span>$20,000</span>
                </div>
              </div>

              {/* CPU Usage Limit */}
              <div className="space-y-4">
                <div className="flex justify-between items-end gap-4">
                  <div className="min-w-0">
                    <label className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="truncate">Max CPU Utilization</span>
                    </label>
                    <p className="text-xs text-slate-500 hidden sm:block">Threshold for high-usage warnings and auto-scaling triggers.</p>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-white tracking-tight shrink-0">{limits.max_cpu}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={limits.max_cpu}
                  onChange={(e) => handleUpdateLimit('max_cpu', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                  <span>10%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Carbon Emission Limit */}
              <div className="space-y-4">
                <div className="flex justify-between items-end gap-4">
                  <div className="min-w-0">
                    <label className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate">Max Carbon Emissions</span>
                    </label>
                    <p className="text-xs text-slate-500 hidden sm:block">Maximum allowed CO2 footprint per billing cycle (kg).</p>
                  </div>
                  <span className="text-lg md:text-xl font-bold text-white tracking-tight shrink-0">{limits.max_carbon}kg</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={limits.max_carbon}
                  onChange={(e) => handleUpdateLimit('max_carbon', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                  <span>50kg</span>
                  <span>2,000kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Predictive Insights */}
          <div className="glass-card p-4 md:p-6 border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent">
            <h3 className="text-xs md:text-sm font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Predictive Safety Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Budget Trend</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">Based on current spending velocity, you will reach <span className="text-white font-bold">85%</span> of your budget by the 25th of the month.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Resource Health</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">CPU utilization is trending <span className="text-white font-bold">12% lower</span> than last week. No immediate scaling risk detected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
