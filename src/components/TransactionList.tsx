import { FileText, CheckCircle2, AlertCircle, Clock, ArrowRight, BellRing, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice } from '../data/mockData';
import { generateInvoicePDF } from '../utils/pdfGenerator';
import { useAppContext } from '../context/AppContext';

type TabType = 'all' | 'created' | 'received';

interface TransactionListProps {
  invoices: Invoice[];
  activeTab: TabType;
  onSelectInvoice: (inv: Invoice) => void;
  onPay: (id: string) => void;
}

export default function TransactionList({ invoices, activeTab, onSelectInvoice, onPay }: TransactionListProps) {
  const { showToast } = useAppContext();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Pending': return { 
        color: 'bg-orange-100 text-orange-700 border-orange-200', 
        icon: Clock,
        animate: 'animate-pulse'
      };
      case 'Pending Acceptance': return { 
        color: 'bg-amber-100 text-amber-700 border-amber-200', 
        icon: Clock,
        animate: 'animate-pulse'
      };
      case 'Accepted': return { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
        icon: CheckCircle2,
        animate: ''
      };
      case 'Rejected': return { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        icon: AlertCircle,
        animate: ''
      };
      case 'Expired': return { 
        color: 'bg-gray-100 text-gray-700 border-gray-200', 
        icon: AlertCircle,
        animate: ''
      };
      case 'Paid':
      case 'Completed': return { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
        icon: CheckCircle2,
        animate: ''
      };
      case 'Overdue': return { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        icon: AlertCircle,
        animate: 'animate-bounce'
      };
      default: return { 
        color: 'bg-gray-100 text-gray-700 border-gray-200', 
        icon: FileText,
        animate: ''
      };
    }
  };

  const renderActions = (invoice: Invoice) => {
    const isBuyer = invoice.type === 'received';
    const isSeller = invoice.type === 'sent';
    
    if (isBuyer && ['Unpaid', 'Overdue', 'Partially Paid', 'Accepted'].includes(invoice.status)) {
      return (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPay(invoice.id);
          }}
          className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          Pay Now
          <ArrowRight className="w-3 h-3" />
        </button>
      );
    }

    if (isSeller) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              showToast(`Reminder sent to ${invoice.buyer} for ${invoice.reference}`, 'success');
            }}
            className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center"
            title="Remind Buyer"
          >
            <BellRing className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectInvoice(invoice);
            }}
            className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant/30">
        <CheckCircle2 className="w-5 h-5" />
      </div>
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">Recent Transactions</h3>
        <span className="text-xs font-bold text-on-surface-variant/40">{invoices.length} Items</span>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {invoices.length > 0 ? (
            invoices.map((invoice) => {
              const status = getStatusConfig(invoice.status);
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={invoice.id}
                  onClick={() => onSelectInvoice(invoice)}
                  className="bg-white p-5 rounded-3xl border border-outline-variant/15 flex flex-col md:flex-row md:items-center justify-between hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-on-surface text-lg group-hover:text-primary transition-colors">
                          {invoice.type === 'sent' ? invoice.buyer : invoice.seller}
                        </h4>
                        {invoice.isManualEntry && (
                          <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Manual Entry</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                        {invoice.date} • {invoice.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-left md:text-right">
                      <p className="text-xl font-extrabold text-on-surface mb-1 group-hover:scale-105 transition-transform origin-right">
                        ₦{invoice.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                      <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${status.color} ${status.animate}`}>
                        <StatusIcon className="w-3 h-3" />
                        {invoice.status}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateInvoicePDF(invoice);
                          showToast('Invoice downloaded successfully', 'success');
                        }}
                        className="w-10 h-10 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {renderActions(invoice)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-24 text-center bg-surface-container-lowest rounded-[2.5rem] border border-dashed border-outline-variant/30"
            >
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant/30">
                <FileText className="w-10 h-10" />
              </div>
              <p className="text-on-surface-variant font-bold">No transactions found</p>
              <p className="text-sm text-on-surface-variant/60">Try adjusting your filters or search query.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
