import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import OptimizationDashboard from './pages/OptimizationDashboard';
import CarbonLedger from './pages/CarbonLedger';
import Automation from './pages/Automation';
import Guardrails from './pages/Guardrails';
import Config from './pages/Config';
import { Cloud, Bell, Search, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PageWrapper = ({ children, pageKey }: { children: React.ReactNode, pageKey: string }) => (
  <motion.div
    key={pageKey}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageWrapper pageKey="dashboard"><Dashboard /></PageWrapper>} />
        <Route path="/optimizer" element={<PageWrapper pageKey="optimizer"><OptimizationDashboard /></PageWrapper>} />
        <Route path="/carbon" element={<PageWrapper pageKey="carbon"><CarbonLedger /></PageWrapper>} />
        <Route path="/automation" element={<PageWrapper pageKey="automation"><Automation /></PageWrapper>} />
        <Route path="/guardrails" element={<PageWrapper pageKey="guardrails"><Guardrails /></PageWrapper>} />
        <Route path="/config" element={<PageWrapper pageKey="config"><Config /></PageWrapper>} />
        <Route path="/analysis" element={<PageWrapper pageKey="analysis"><div className="p-8">Cost Analysis Page (Coming Soon)</div></PageWrapper>} />
        <Route path="/optimization" element={<PageWrapper pageKey="optimization"><div className="p-8">Optimizations Page (Coming Soon)</div></PageWrapper>} />
        <Route path="/security" element={<PageWrapper pageKey="security"><div className="p-8">Security Page (Coming Soon)</div></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper pageKey="settings"><div className="p-8">Settings Page (Coming Soon)</div></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0f18] text-slate-200 flex font-sans overflow-x-hidden">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        
        <main className="flex-1 min-w-0 overflow-y-auto">
          <header className="h-16 md:h-20 bg-[#0a0f18]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-4 md:gap-6 flex-1">
              <button 
                onClick={() => setMobileOpen(true)}
                className="p-2 text-slate-400 hover:text-white lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="relative max-w-md w-full hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search infrastructure..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                <Cloud className="w-3 h-3" />
                <span className="hidden xs:inline">AWS-PROD-NODE-01</span>
                <span className="xs:hidden">PROD-01</span>
              </div>
              
              <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#0a0f18]" />
              </button>

              <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-6 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-white">Arnav Verma</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Admin Tier</p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 border border-white/20 shadow-lg" />
              </div>
            </div>
          </header>

          <div className="relative">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}
