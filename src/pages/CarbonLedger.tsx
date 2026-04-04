import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Globe, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Leaf
} from 'lucide-react';
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

const ledgerData = [
  { id: '1', date: '2026-04-01', region: 'us-east-1', instance: 't3.large', emissions: 45.2, cost: 12.50, status: 'optimized' },
  { id: '2', date: '2026-04-01', region: 'us-west-2', instance: 'm5.xlarge', emissions: 12.8, cost: 45.00, status: 'baseline' },
  { id: '3', date: '2026-03-31', region: 'eu-west-1', instance: 't3.medium', emissions: 22.4, cost: 8.20, status: 'optimized' },
  { id: '4', date: '2026-03-31', region: 'ap-southeast-1', instance: 'c5.large', emissions: 85.6, cost: 24.50, status: 'baseline' },
  { id: '5', date: '2026-03-30', region: 'us-east-1', instance: 't3.large', emissions: 44.8, cost: 12.50, status: 'optimized' },
  { id: '6', date: '2026-03-30', region: 'ca-central-1', instance: 't3.small', emissions: 2.1, cost: 4.20, status: 'optimized' },
];

const chartData = [
  { date: '03-25', emissions: 240 },
  { date: '03-26', emissions: 300 },
  { date: '03-27', emissions: 280 },
  { date: '03-28', emissions: 350 },
  { date: '03-29', emissions: 320 },
  { date: '03-30', emissions: 290 },
  { date: '03-31', emissions: 210 },
  { date: '04-01', emissions: 180 },
];

export default function CarbonLedger() {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  const filteredData = ledgerData.filter(item => 
    (regionFilter === 'all' || item.region === regionFilter) &&
    (item.instance.toLowerCase().includes(searchTerm.toLowerCase()) || item.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalEmissions = filteredData.reduce((acc, curr) => acc + curr.emissions, 0);
  const totalCost = filteredData.reduce((acc, curr) => acc + curr.cost, 0);

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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight neon-text-emerald">Carbon Ledger</h2>
          <p className="text-slate-400 mt-1 text-sm md:text-base">Historical emissions tracking and environmental audit.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-full sm:w-auto px-4 py-2 glass-card border-white/10 hover:border-emerald-500/30 flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95">
            <Download className="w-4 h-4" />
            Export Audit
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Emissions', value: `${totalEmissions.toFixed(1)}kg`, icon: Leaf, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Avg. Intensity', value: '312g/kWh', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Total Cost', value: `$${totalCost.toFixed(2)}`, icon: TrendingDown, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Green Score', value: 'A+', icon: Globe, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass-card p-4 md:p-5 border-white/5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{stat.label}</p>
              <h4 className="text-lg md:text-xl font-bold text-white mt-0.5">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 glass-card p-4 md:p-6 border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-xs md:text-sm font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Emissions Trend (kg CO2)
            </h3>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Optimized</span>
            </div>
          </div>
          <div className="h-48 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#10b981" fillOpacity={1} fill="url(#colorEmissions)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 glass-card p-4 md:p-6 border-white/5 flex flex-col">
          <h3 className="text-xs md:text-sm font-bold mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-400" />
            Regional Distribution
          </h3>
          <div className="flex-1 space-y-4">
            {[
              { region: 'us-east-1', value: 45, color: 'bg-blue-500' },
              { region: 'us-west-2', value: 25, color: 'bg-emerald-500' },
              { region: 'eu-west-1', value: 20, color: 'bg-purple-500' },
              { region: 'ap-southeast-1', value: 10, color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono uppercase">{item.region}</span>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card border-white/5 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <h3 className="text-xs md:text-sm font-bold">Emissions History</h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors w-full sm:w-48 md:w-64"
              />
            </div>
            <select 
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none"
            >
              <option value="all">All Regions</option>
              <option value="us-east-1">us-east-1</option>
              <option value="us-west-2">us-west-2</option>
              <option value="eu-west-1">eu-west-1</option>
              <option value="ap-southeast-1">ap-southeast-1</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Region</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Instance</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Emissions</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Cost</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredData.map((item, i) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 text-xs font-mono text-slate-400">{item.date}</td>
                  <td className="p-4 text-xs font-bold text-white uppercase tracking-tighter">{item.region}</td>
                  <td className="p-4 text-xs text-slate-300">{item.instance}</td>
                  <td className="p-4 text-xs font-bold text-emerald-400 text-right">{item.emissions}kg</td>
                  <td className="p-4 text-xs font-bold text-white text-right">${item.cost.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      item.status === 'optimized' 
                        ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' 
                        : 'text-blue-400 bg-blue-400/10 border-blue-400/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
