import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertTriangle, 
  AlertCircle, 
  X, 
  Bell,
  TrendingUp,
  DollarSign,
  Globe
} from 'lucide-react';

interface Alert {
  type: 'budget' | 'cpu' | 'carbon';
  message: string;
  severity: 'warning' | 'critical';
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onDismiss: (index: number) => void;
}

export default function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const getIcon = (type: string) => {
    if (type === 'budget') return DollarSign;
    if (type === 'cpu') return TrendingUp;
    return Globe;
  };

  return (
    <div className="glass-card border-white/5 overflow-hidden flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xs md:text-sm font-bold flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          Active Guardrail Alerts
        </h3>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{alerts.length} Active</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center p-6 md:p-8"
            >
              <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
              </div>
              <p className="text-slate-400 text-xs md:text-sm font-medium">No active alerts. System is within guardrails.</p>
            </motion.div>
          ) : (
            alerts.map((alert, i) => {
              const Icon = getIcon(alert.type);
              const isCritical = alert.severity === 'critical';
              
              return (
                <motion.div
                  key={alert.timestamp + i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`p-3 md:p-4 rounded-2xl border ${
                    isCritical 
                      ? 'bg-red-500/10 border-red-500/20' 
                      : 'bg-amber-500/10 border-amber-500/20'
                  } group relative`}
                >
                  <div className="flex gap-3 md:gap-4">
                    <div className={`p-2 rounded-lg shrink-0 h-fit ${
                      isCritical ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${
                          isCritical ? 'text-red-400' : 'text-amber-400'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium leading-relaxed pr-6">{alert.message}</p>
                    </div>
                    <button 
                      onClick={() => onDismiss(i)}
                      className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
