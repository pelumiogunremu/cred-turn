import React from 'react';
import { LucideIcon } from 'lucide-react';


interface SettingsItemProps {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  rightElement?: React.ReactNode;
  isToggle?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}


export default function SettingsItem({ label, icon: Icon, onClick, rightElement, isToggle, checked, onChange }: SettingsItemProps) {
  const content = (
    <>
      <div className="flex items-center gap-4">
        <Icon className="text-on-surface-variant group-hover:text-primary transition-colors w-6 h-6" strokeWidth={2.5} />
        <span className="font-semibold text-on-surface">{label}</span>
      </div>
      {isToggle ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={checked} 
            onChange={(e) => onChange?.(e.target.checked)} 
          />
          <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      ) : (
        rightElement
      )}
    </>
  );


  if (isToggle || !onClick) {
    return (
      <div className="flex items-center justify-between p-5 border-b border-outline-variant/10 last:border-0">
        {content}
      </div>
    );
  }


  return (
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 hover:bg-surface-container-high transition-colors text-left group border-b border-outline-variant/10 last:border-0">
      {content}
    </button>
  );
}
