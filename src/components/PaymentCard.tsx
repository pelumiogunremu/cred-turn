import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PaymentCardProps {
  key?: string | number;
  title: string;
  subtitle: string;
  amount: string;
  dueDate: string;
  status: string;
  icon: LucideIcon;
  iconBgClass: string;
  iconTextClass: string;
  amountLabel?: string;
}

export default function PaymentCard({
  title,
  subtitle,
  amount,
  dueDate,
  status,
  icon: Icon,
  iconBgClass,
  iconTextClass,
  amountLabel = 'Amount'
}: PaymentCardProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 flex items-center justify-between hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClass} ${iconTextClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-on-surface">{title}</h3>
          <p className="text-xs text-on-surface-variant font-medium">{subtitle}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Due {dueDate}</span>
            <span className="w-1 h-1 rounded-full bg-outline-variant/40"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{status}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">{amountLabel}</p>
        <p className="text-xl font-extrabold text-on-surface tracking-tight group-hover:text-primary transition-colors">{amount}</p>
      </div>
    </div>
  );
}
