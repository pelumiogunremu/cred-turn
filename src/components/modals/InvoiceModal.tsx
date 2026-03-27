import { motion } from 'motion/react';
import { X, Download, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { StatusBadge } from '../ui';

export default function InvoiceModal() {
  const navigate = useNavigate();
  const { selectedInvoice, setSelectedInvoice, updateInvoiceStatus, showToast } = useAppContext();

  if (!selectedInvoice) return null;

  const handleDownload = () => {
    generateInvoicePDF(selectedInvoice);
    showToast('Invoice downloaded successfully', 'success');
  };

  const handleRemindBuyer = () => {
    showToast('Reminder sent successfully', 'success');
  };

  const handleAccept = () => {
    updateInvoiceStatus(selectedInvoice.id, 'Not Due');
    showToast('Invoice accepted', 'success');
    setSelectedInvoice(null);
  };

  const handleReject = () => {
    updateInvoiceStatus(selectedInvoice.id, 'Rejected');
    showToast('Invoice rejected', 'info');
    setSelectedInvoice(null);
  };

  // "Paid with Cash" — marks invoice as Paid for physical/offline payment
  const handlePaidWithCash = () => {
    updateInvoiceStatus(selectedInvoice.id, 'Paid');
    showToast('Marked as paid with cash', 'success');
    setSelectedInvoice(null);
  };

  const canPayNow =
    selectedInvoice.type === 'received' &&
    ['Not Due', 'Due', 'Overdue', 'Partially Paid'].includes(selectedInvoice.status);

  const canPaidWithCash =
    selectedInvoice.type === 'sent' &&
    ['Pending', 'Not Due', 'Due', 'Overdue', 'Partially Paid'].includes(selectedInvoice.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-headline">Invoice Details</h2>
          <button onClick={() => setSelectedInvoice(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Amount</span>
            <span className="text-2xl font-bold text-on-surface">₦{selectedInvoice.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Status</span>
            <StatusBadge status={selectedInvoice.status} />
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Reference</span>
            <span className="font-medium text-on-surface">{selectedInvoice.reference}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Buyer</span>
            <span className="font-medium text-on-surface">{selectedInvoice.buyer}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Due Date</span>
            <span className="font-medium text-on-surface">{selectedInvoice.dueDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Seller</span>
            <span className="font-medium text-on-surface">{selectedInvoice.seller}</span>
          </div>
          
          <div className="pt-4 flex flex-col gap-3">
            {selectedInvoice.type === 'received' && selectedInvoice.status === 'Pending' && (
              <div className="flex gap-3">
                <button onClick={handleReject} className="flex-1 ct-btn-secondary text-error hover:bg-error/10">
                  Reject
                </button>
                <button onClick={handleAccept} className="flex-[2] ct-btn-primary">
                  Accept Invoice
                </button>
              </div>
            )}

            {/* Buyer flow: Pay Now — goes to this specific invoice's payment page */}
            {canPayNow && (
              <button
                onClick={() => {
                  setSelectedInvoice(null);
                  navigate('/payments', { state: { invoiceId: selectedInvoice.id } });
                }}
                className="ct-btn-primary w-full"
              >
                Pay Now
              </button>
            )}

            {/* Seller flow: remind buyer if pending */}
            {selectedInvoice.type === 'sent' && selectedInvoice.status === 'Pending' && (
              <button onClick={handleRemindBuyer} className="ct-btn-secondary w-full">
                Remind Buyer
              </button>
            )}

            {/* Seller flow: mark as paid with cash for physical payments */}
            {canPaidWithCash && (
              <button
                onClick={handlePaidWithCash}
                className="w-full flex items-center justify-center gap-2 bg-surface-container-low text-on-surface border border-outline-variant/30 font-bold py-3 rounded-xl hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
              >
                <Banknote className="w-4 h-4" />
                Paid with Cash
              </button>
            )}

            {/* Shared: Download */}
            <button onClick={handleDownload} className="ct-btn-secondary w-full">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
