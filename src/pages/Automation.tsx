import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  TrendingDown, 
  Globe, 
  Activity,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Info
} from 'lucide-react';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import AutomationStatus from '../components/automation/AutomationStatus';
import AutomationLogs from '../components/automation/AutomationLogs';

interface AutomationSettings {
  auto_scale: boolean;
  shutdown_idle: boolean;
  shift_workload: boolean;
  schedule_optimization: boolean;
}

interface LogEntry {
  timestamp: string;
  action: string;
  resource: string;
  savings: number;
  status: 'success' | 'warning' | 'error';
}

export default function Automation() {
  const [settings, setSettings] = useState<AutomationSettings>({
    auto_scale: false,
    shutdown_idle: false,
    shift_workload: false,
    schedule_optimization: false
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, logsRes] = await Promise.all([
        fetch('/api/automation'),
        fetch('/api/automation/logs')
      ]);
      
      if (!settingsRes.ok || !logsRes.ok) throw new Error('Failed to fetch automation data');
      
      const settingsData = await settingsRes.json();
      const logsData = await logsRes.json();
      
      setSettings(settingsData);
      setLogs(logsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (key: keyof AutomationSettings, value: boolean) => {
    setIsUpdating(true);
    const newSettings = { ...settings, [key]: value };
    try {
      const res = await fetch('/api/automation/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      
      if (!res.ok) throw new Error('Failed to update settings');
      
      const updatedSettings = await res.json();
      setSettings(updatedSettings);
      
      // Refresh logs after update
      const logsRes = await fetch('/api/automation/logs');
      if (logsRes.ok) {
        setLogs(await logsRes.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const activeRulesCount = Object.values(settings).filter(Boolean).length;
  const totalSavings = logs.reduce((acc, curr) => acc + curr.savings, 0);
  const lastAction = logs.length > 0 ? logs[0].action : 'None';

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        <div className="h-8 md:h-10 w-32 md:w-48 bg-white/5 rounded-lg shimmer" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 md:h-24 bg-white/5 rounded-2xl shimmer" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 h-96 bg-white/5 rounded-2xl shimmer" />
          <div className="h-96 bg-white/5 rounded-2xl shimmer" />
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight neon-text-emerald">Automation Engine</h2>
          <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm md:text-base">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Autonomous resource management and cost optimization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchData}
            className="p-2 glass-card border-white/10 hover:border-emerald-500/30 transition-all group"
          >
            <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-emerald-400 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
          <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            Engine Active
          </div>
        </div>
      </div>

      {/* Status Panel */}
      <AutomationStatus 
        activeRules={activeRulesCount}
        totalSavings={`$${totalSavings.toFixed(2)}`}
        carbonReduced={`${(totalSavings * 0.4).toFixed(1)}kg`}
        lastAction={lastAction}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Rules Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-4 md:p-6 border-white/5">
            <h3 className="text-xs md:text-sm font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Active Automation Rules
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleSwitch 
                isOn={settings.auto_scale}
                onToggle={(val) => handleToggle('auto_scale', val)}
                label="Auto-Scale Resources"
                description="Dynamically adjust instance counts based on traffic."
                disabled={isUpdating}
              />
              <ToggleSwitch 
                isOn={settings.shutdown_idle}
                onToggle={(val) => handleToggle('shutdown_idle', val)}
                label="Shut Down Idle"
                description="Automatically terminate resources with < 5% utilization."
                disabled={isUpdating}
              />
              <ToggleSwitch 
                isOn={settings.shift_workload}
                onToggle={(val) => handleToggle('shift_workload', val)}
                label="Carbon Shifting"
                description="Move workloads to regions with lowest carbon intensity."
                disabled={isUpdating}
              />
              <ToggleSwitch 
                isOn={settings.schedule_optimization}
                onToggle={(val) => handleToggle('schedule_optimization', val)}
                label="Scheduled Optimization"
                description="Perform deep resource analysis every 24 hours."
                disabled={isUpdating}
              />
            </div>
          </div>

          <AutomationLogs logs={logs} />
        </div>

        {/* Suggestions & Insights */}
        <div className="space-y-6">
          <div className="glass-card p-4 md:p-6 border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
            <h3 className="text-xs md:text-sm font-bold mb-4 md:mb-6 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              AI Rule Suggestions
            </h3>
            
            <div className="space-y-4">
              {[
                { title: 'Enable auto-scaling to save 15% cost', impact: 'high', icon: TrendingDown },
                { title: 'Shut down idle instances at night', impact: 'medium', icon: Zap },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <item.icon className="w-4 h-4 text-emerald-400" />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      item.impact === 'high' ? 'text-emerald-400' : 'text-blue-400'
                    }`}>
                      {item.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">{item.title}</p>
                  <div className="flex items-center gap-1 mt-3 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                    Apply Suggestion
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 border-white/5">
            <h3 className="text-xs md:text-sm font-bold mb-4">Automation Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Success Rate</span>
                <span className="text-emerald-400 font-bold">99.8%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[99.8%]" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Latency</span>
                <span className="text-blue-400 font-bold">42ms</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[42%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
