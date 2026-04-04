import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Server, 
  DollarSign 
} from 'lucide-react';

interface LogEntry {
  timestamp: string;
  action: string;
  resource: string;
  savings: number;
  status: 'success' | 'warning' | 'error';
}

interface AutomationLogsProps {
  logs: LogEntry[];
}

export default function AutomationLogs({ logs }: AutomationLogsProps) {
  return (
    <div className="glass-card border-white/5 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-xs md:text-sm font-bold flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Activity Log
        </h3>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last 20 Actions</span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-white/5">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Timestamp</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Action</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Resource</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Savings</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log, i) => (
              <motion.tr 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="p-4 text-xs font-mono text-slate-400">
                  {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="p-4 text-xs font-bold text-white uppercase tracking-tighter">
                  {log.action}
                </td>
                <td className="p-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Server className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate max-w-[120px]">{log.resource}</span>
                  </div>
                </td>
                <td className="p-4 text-xs font-bold text-emerald-400 text-right">
                  +${log.savings.toFixed(2)}
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center">
                    {log.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
