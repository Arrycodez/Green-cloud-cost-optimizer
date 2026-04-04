import { 
  TrendingDown, 
  Globe, 
  Cloud, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -4 }}
    className="glass-card p-6 border-white/5 shadow-sm hover:shadow-emerald-500/10 transition-all group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
        <Icon className="w-6 h-6 text-emerald-500" />
      </div>
      <span className={`flex items-center text-[10px] font-bold uppercase tracking-wider ${trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </span>
    </div>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest relative z-10">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1 relative z-10">{value}</p>
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-10">
      <div>
        <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">System Overview</h2>
        <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm md:text-base">
          <Activity className="w-4 h-4 text-emerald-500" />
          Real-time infrastructure health and sustainability metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Monthly Spend" value="$12,450.00" change="8.2%" icon={TrendingDown} trend="down" />
        <StatCard title="Carbon Emission" value="2.4 tons" change="14.5%" icon={Globe} trend="down" />
        <StatCard title="Active Resources" value="1,284" change="2.1%" icon={Cloud} trend="up" />
        <StatCard title="Optimization Savings" value="$3,120.00" change="12.4%" icon={Zap} trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="glass-card p-4 md:p-8 border-white/5 h-[300px] md:h-96 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <h3 className="font-bold text-white text-base md:text-lg">Infrastructure Efficiency</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20">COST</button>
                <button className="px-3 py-1 bg-white/5 text-slate-500 text-[10px] font-bold rounded-lg border border-white/10">CARBON</button>
              </div>
            </div>
            <div className="flex-1 bg-black/20 rounded-2xl flex items-center justify-center border border-white/5 border-dashed shimmer">
              <div className="text-center relative z-10 p-4">
                <Activity className="w-8 md:w-12 h-8 md:h-12 text-slate-700 mx-auto mb-4 animate-pulse" />
                <p className="text-slate-500 text-xs md:text-sm font-medium">Telemetry data stream active...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
            <h3 className="font-bold text-lg md:text-xl mb-3">Sustainability Goal</h3>
            <p className="text-emerald-100 text-xs md:text-sm mb-6 md:mb-8 leading-relaxed">Your organization is currently offsetting <span className="font-bold text-white">65%</span> of its digital carbon footprint.</p>
            
            <div className="space-y-4 md:space-y-6">
              <div className="w-20 md:w-24 h-20 md:h-24 rounded-full border-4 border-white/10 flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent -rotate-45" />
                <span className="text-xl md:text-2xl font-bold">65%</span>
              </div>
              <button className="w-full py-3 md:py-4 bg-white text-emerald-700 rounded-xl md:rounded-2xl text-sm font-bold hover:bg-emerald-50 transition-all shadow-lg active:scale-95">
                Generate ESG Report
              </button>
            </div>
          </div>

          <div className="glass-card p-4 md:p-6 border-white/5">
            <h3 className="font-bold text-white mb-4 md:mb-6">Recent Alerts</h3>
            <div className="space-y-4 md:space-y-6">
              {[
                { type: 'optimization', text: 'New right-sizing opportunity found in AWS-PROD', time: '12m ago' },
                { type: 'warning', text: 'Unusual traffic spike detected in us-west-2', time: '1h ago' },
                { type: 'success', text: 'Weekly carbon report is now available', time: '4h ago' },
              ].map((alert, i) => (
                <div key={i} className="flex gap-3 md:gap-4 group cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                    alert.type === 'optimization' ? 'bg-blue-500' : 
                    alert.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <p className="text-xs md:text-sm text-slate-300 group-hover:text-white transition-colors">{alert.text}</p>
                    <p className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
