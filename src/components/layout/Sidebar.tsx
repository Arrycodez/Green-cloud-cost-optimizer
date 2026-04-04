import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Settings, 
  LayoutDashboard, 
  ShieldCheck,
  Globe,
  Cpu,
  Zap,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/' },
    { id: 'optimizer', label: 'Neural Optimizer', icon: Cpu, path: '/optimizer' },
    { id: 'carbon', label: 'Carbon Ledger', icon: Globe, path: '/carbon' },
    { id: 'automation', label: 'Automation Engine', icon: Zap, path: '/automation' },
    { id: 'guardrails', label: 'Guardrails', icon: ShieldCheck, path: '/guardrails' },
    { id: 'config', label: 'Config', icon: Settings, path: '/config' },
  ];

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-[#0a0f18] border-r border-white/5 overflow-hidden">
      <div className="p-6 md:p-8 flex items-center gap-3 overflow-hidden">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
          <Leaf className="text-white w-6 h-6" />
        </div>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-white tracking-tight leading-tight whitespace-nowrap"
            >
              GreenCloud<br/><span className="text-emerald-500">Optimizer</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
          >
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative group ${
                location.pathname === item.path 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${location.pathname === item.path ? 'text-emerald-400' : 'text-slate-500'}`} />
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {location.pathname === item.path && (!isCollapsed || isMobile) && (
                <motion.div 
                  layoutId="active-nav-pill"
                  className="absolute right-4 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                />
              )}
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass-card p-4 border-emerald-500/20 bg-emerald-500/5"
            >
              <p className="text-[10px] text-emerald-500/70 font-bold uppercase tracking-widest mb-2">Eco Performance</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-white">84</span>
                <span className="text-xs text-emerald-500 font-medium mb-1.5">/100</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[84%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isMobile && (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-white transition-colors group"
          >
            <Menu className={`w-5 h-5 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Collapse</span>}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar (Overlay + Drawer) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] z-[70] lg:hidden"
            >
              <SidebarContent isMobile />
              <button 
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-[-50px] p-2 bg-[#0a0f18] border border-white/10 rounded-xl text-white lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 z-40 overflow-hidden shrink-0 transition-all duration-300"
      >
        <SidebarContent />
      </motion.aside>
    </>
  );
}
