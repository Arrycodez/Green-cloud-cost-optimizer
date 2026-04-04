import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Cloud, 
  Globe, 
  Zap, 
  ShieldCheck, 
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  Moon,
  Sun,
  Key,
  TrendingDown,
  Info
} from 'lucide-react';

interface ConfigSettings {
  cloud_provider: string;
  region: string;
  priority: number;
  api_key: string;
  theme: 'dark' | 'light';
}

export default function Config() {
  const [settings, setSettings] = useState<ConfigSettings>({
    cloud_provider: 'aws',
    region: 'us-east-1',
    priority: 50,
    api_key: '********************',
    theme: 'dark'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/config/get');
        if (!res.ok) throw new Error('Failed to fetch configuration');
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);
    try {
      const res = await fetch('/api/config/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save configuration');
      
      const updatedData = await res.json();
      setSettings(updatedData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="h-8 md:h-10 w-32 md:w-48 bg-white/5 rounded-lg shimmer" />
        <div className="h-[400px] md:h-[500px] bg-white/5 rounded-2xl shimmer" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 md:space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight neon-text-emerald">System Configuration</h2>
          <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm md:text-base">
            <Settings className="w-4 h-4 text-emerald-500" />
            Manage your cloud infrastructure preferences.
          </p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
        <div className="glass-card p-4 md:p-8 border-white/5 space-y-8 md:space-y-10">
          {/* Cloud Provider & Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-400" />
                Cloud Provider
              </label>
              <select 
                value={settings.cloud_provider}
                onChange={(e) => setSettings({ ...settings, cloud_provider: e.target.value })}
                className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white text-sm focus:border-emerald-500/50 focus:ring-0 transition-all outline-none appearance-none"
              >
                <option value="aws" className="bg-slate-900">Amazon Web Services (AWS)</option>
                <option value="gcp" className="bg-slate-900">Google Cloud Platform (GCP)</option>
                <option value="azure" className="bg-slate-900">Microsoft Azure</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-400" />
                Primary Region
              </label>
              <select 
                value={settings.region}
                onChange={(e) => setSettings({ ...settings, region: e.target.value })}
                className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white text-sm focus:border-emerald-500/50 focus:ring-0 transition-all outline-none appearance-none"
              >
                <option value="us-east-1" className="bg-slate-900">US East (N. Virginia)</option>
                <option value="us-west-2" className="bg-slate-900">US West (Oregon)</option>
                <option value="eu-central-1" className="bg-slate-900">EU (Frankfurt)</option>
                <option value="ap-southeast-1" className="bg-slate-900">Asia Pacific (Singapore)</option>
              </select>
            </div>
          </div>

          {/* Optimization Priority Slider */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
              <div className="space-y-1">
                <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Optimization Priority
                </label>
                <p className="text-xs text-slate-500">Balance between cost savings and sustainability impact.</p>
              </div>
              <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
                <span className={settings.priority < 50 ? 'text-emerald-400' : 'text-slate-600'}>Cost</span>
                <span className={settings.priority >= 50 ? 'text-emerald-400' : 'text-slate-600'}>Sustainability</span>
              </div>
            </div>
            <div className="relative pt-4">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={settings.priority}
                onChange={(e) => setSettings({ ...settings, priority: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between mt-4">
                <div className="flex flex-col items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Budget First</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Eco First</span>
                </div>
              </div>
            </div>
          </div>

          {/* API Key & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-3">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Cloud API Key
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={settings.api_key}
                  onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                  placeholder="Enter your API key"
                  className="w-full p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl text-white text-sm focus:border-emerald-500/50 focus:ring-0 transition-all outline-none pr-12"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <Info className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                Interface Theme
              </label>
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setSettings({ ...settings, theme: 'dark' })}
                  className={`flex-1 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    settings.theme === 'dark' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Dark
                </button>
                <button 
                  type="button"
                  onClick={() => setSettings({ ...settings, theme: 'light' })}
                  className={`flex-1 py-2.5 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    settings.theme === 'light' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  Light
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 glass-card border-white/5 bg-emerald-500/5 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Secure Configuration</p>
              <p className="text-xs text-slate-500">Your settings are encrypted.</p>
            </div>
          </div>
          <button 
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded-xl md:rounded-2xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 active:scale-95"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
