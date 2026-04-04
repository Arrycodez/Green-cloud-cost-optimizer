import React from 'react';
import { motion } from 'motion/react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export default function ToggleSwitch({ isOn, onToggle, label, description, disabled }: ToggleSwitchProps) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
      <div className="flex-1">
        <label className="text-sm font-bold text-white block mb-1">{label}</label>
        {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
      </div>
      
      <button
        onClick={() => !disabled && onToggle(!isOn)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 mt-1 ${
          isOn 
            ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
            : 'bg-slate-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <motion.div
          animate={{ x: isOn ? 26 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}
