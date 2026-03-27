import React from 'react';
import { FileUp, Download as DownloadIcon, FileDown } from 'lucide-react';

interface InvoiceItemProps {
  key?: string | number;
  type: 'sent' | 'received';
  name: string;
  reference: string;
  amount: string;
  status: string;
  isManualEntry?: boolean;
  onClick?: () => void;
  onDownload?: (e: React.MouseEvent) => void;
  onPay?: (e: React.MouseEvent) => void;
  showPayButton?: boolean;
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'bg-orange-100 text-orange-700';
    case 'not due': return 'bg-teal-100 text-teal-700';
    case 'due': return 'bg-amber-100 text-amber-700';
    case 'paid': return 'bg-emerald-100 text-emerald-700';
    case 'rejected': return 'bg-red-100 text-red-700';
    case 'expired': return 'bg-gray-100 text-gray-700';
    case 'partially paid': return 'bg-blue-100 text-blue-700';
    case 'overdue': return 'bg-red-100 text-red-700';
    default: return 'bg-surface-container-high text-on-surface-variant';
  }
};

export default function InvoiceItem({ type, name, reference, amount, status, isManualEntry, onClick, onDownload, onPay, showPayButton }: InvoiceItemProps) {
  const isSent = type === 'sent';
  const Icon = isSent ? FileUp : DownloadIcon;

  return (
    <div onClick={onClick} className="px-5 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 hover:bg-surface-container-low/50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSent ? 'bg-surface-container-high text-on-surface-variant' : 'bg-emerald-50 text-primary'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-on-surface text-base">{name}</p>
            {isManualEntry && (
              <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Manual Entry</span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant">{reference}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {showPayButton && onPay && (
          <button 
            onClick={onPay}
            className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
          >
            Pay Now
          </button>
        )}
        <div className="text-right">
          <p className="font-bold text-on-surface text-base">{amount}</p>
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>
        {onDownload && (
          <button 
            onClick={onDownload}
            className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Download PDF"
          >
            <FileDown className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
