import { ArrowLeft, Download, FileText, CheckCircle2, Clock, Building2, Mail, Calendar, AlertCircle } from 'lucide-react';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'Not Due': return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400';
    case 'Due': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'Pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    case 'Partially Paid': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'Expired': return 'bg-surface-container-high text-on-surface-variant';
    default: return 'bg-surface-container-high text-on-surface-variant';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Paid': return <CheckCircle2 className="w-4 h-4" />;
    case 'Not Due': return <CheckCircle2 className="w-4 h-4" />;
    case 'Due': return <Clock className="w-4 h-4" />;
    case 'Overdue': return <AlertCircle className="w-4 h-4" />;
    case 'Pending': return <Clock className="w-4 h-4" />;
    case 'Partially Paid': return <CheckCircle2 className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export function InvoiceDetailHeader({ 
  invoiceNumber, 
  status, 
  isReceived, 
  onBack,
  onDownload
}: { 
  invoiceNumber: string; 
  status: string; 
  isReceived: boolean; 
  onBack: () => void;
  onDownload?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">Invoice {invoiceNumber}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              {status}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">• {isReceived ? 'Received' : 'Sent'}</span>
          </div>
        </div>
      </div>
      <button onClick={onDownload} className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors" title="Download PDF">
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
}

export function InvoiceParties({ isReceived, clientName }: { isReceived: boolean; clientName: string }) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
      <div>
        <h2 className="text-sm font-label uppercase tracking-widest text-on-surface-variant/70 mb-4 font-bold">From</h2>
        <div className="space-y-1">
          <p className="font-bold text-on-surface text-lg">{isReceived ? clientName : 'CredTurn Inc.'}</p>
          <p className="text-on-surface-variant text-sm flex items-center gap-2"><Building2 className="w-4 h-4 opacity-70" /> 123 Business Rd, Suite 100</p>
          <p className="text-on-surface-variant text-sm flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /> billing@{isReceived ? clientName.toLowerCase().replace(/\s+/g, '') : 'credturn'}.com</p>
        </div>
      </div>
      <div className="md:text-right">
        <h2 className="text-sm font-label uppercase tracking-widest text-on-surface-variant/70 mb-4 font-bold">To</h2>
        <div className="space-y-1">
          <p className="font-bold text-on-surface text-lg">{!isReceived ? clientName : 'CredTurn Inc.'}</p>
          <p className="text-on-surface-variant text-sm md:justify-end flex items-center gap-2"><Building2 className="w-4 h-4 opacity-70" /> 456 Client Ave, Floor 2</p>
          <p className="text-on-surface-variant text-sm md:justify-end flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /> contact@{!isReceived ? clientName.toLowerCase().replace(/\s+/g, '') : 'credturn'}.com</p>
        </div>
      </div>
    </div>
  );
}

export function InvoiceSummaryGrid({ dueDate, amount }: { dueDate: string; amount: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-surface-container-low/50 rounded-xl border border-outline-variant/10">
      <div>
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">Invoice Date</p>
        <p className="font-semibold text-on-surface flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Sep 28, 2024</p>
      </div>
      <div>
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">Due Date</p>
        <p className="font-semibold text-on-surface flex items-center gap-2"><Calendar className="w-4 h-4 text-error" /> {dueDate}</p>
      </div>
      <div className="col-span-2 md:col-span-2 md:text-right">
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant/70 mb-1 font-bold">Total Amount Due</p>
        <p className="text-3xl font-headline font-extrabold text-primary tracking-tight">₦{amount.toLocaleString()}</p>
      </div>
    </div>
  );
}

export function InvoiceLineItemsTable({ amount }: { amount: number }) {
  return (
    <div>
      <h3 className="text-sm font-label uppercase tracking-widest text-on-surface-variant/70 mb-4 font-bold flex items-center gap-2">
        <FileText className="w-4 h-4" /> Description of Services
      </h3>
      <div className="border border-outline-variant/15 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/15">
              <th className="py-3 px-4 text-xs font-label uppercase tracking-wider text-on-surface-variant font-bold">Item</th>
              <th className="py-3 px-4 text-xs font-label uppercase tracking-wider text-on-surface-variant font-bold text-right">Qty</th>
              <th className="py-3 px-4 text-xs font-label uppercase tracking-wider text-on-surface-variant font-bold text-right">Rate</th>
              <th className="py-3 px-4 text-xs font-label uppercase tracking-wider text-on-surface-variant font-bold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            <tr className="hover:bg-surface-container-lowest/50 transition-colors">
              <td className="py-4 px-4 text-sm font-medium text-on-surface">Web Design Services (September)</td>
              <td className="py-4 px-4 text-sm text-on-surface-variant text-right">1</td>
              <td className="py-4 px-4 text-sm text-on-surface-variant text-right">₦{amount.toLocaleString()}</td>
              <td className="py-4 px-4 text-sm font-bold text-on-surface text-right">₦{amount.toLocaleString()}</td>
            </tr>
            {/* Add more rows if needed based on mock data complexity */}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-outline-variant/20 bg-surface-container-lowest">
              <td colSpan={3} className="py-4 px-4 text-sm font-bold text-on-surface-variant text-right">Subtotal</td>
              <td className="py-4 px-4 text-sm font-bold text-on-surface text-right">₦{amount.toLocaleString()}</td>
            </tr>
            <tr className="bg-surface-container-lowest">
              <td colSpan={3} className="py-2 px-4 text-sm font-bold text-on-surface-variant text-right">Tax (0%)</td>
              <td className="py-2 px-4 text-sm font-bold text-on-surface text-right">₦0.00</td>
            </tr>
            <tr className="bg-surface-container-low/30">
              <td colSpan={3} className="py-4 px-4 text-base font-extrabold text-on-surface text-right uppercase tracking-wider">Total</td>
              <td className="py-4 px-4 text-lg font-extrabold text-primary text-right">₦{amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function InvoiceActionButtons({ 
  isReceived, 
  status, 
  invoiceId, 
  onPay 
}: { 
  isReceived: boolean; 
  status: string; 
  invoiceId: string; 
  onPay: () => void;
}) {
  return (
    <>
      {isReceived && ['Not Due', 'Due', 'Partially Paid', 'Overdue'].includes(status) && (
        <div className="flex gap-4 pt-4">
          <button className="flex-1 py-4 rounded-xl font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors">
            Decline
          </button>
          <button 
            onClick={onPay}
            className="flex-[2] bg-primary text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-emerald-600 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-150"
          >
            Pay Invoice Now
          </button>
        </div>
      )}
     
      {!isReceived && status === 'Pending' && (
        <div className="flex gap-4 pt-4">
          <button className="w-full py-4 rounded-xl font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" /> Send Reminder
          </button>
        </div>
      )}
    </>
  );
}