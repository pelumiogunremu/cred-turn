import { motion } from 'motion/react';
import { X, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

export default function InvoiceModal() {
  const navigate = useNavigate();
  const { selectedInvoice, setSelectedInvoice, updateInvoiceStatus, showToast } = useAppContext();

  if (!selectedInvoice) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Acceptance': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Accepted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Paid':
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDownload = () => {
    generateInvoicePDF(selectedInvoice);
    showToast('Invoice downloaded successfully', 'success');
  };

  const handleRemindBuyer = () => {
    showToast('Reminder sent successfully', 'success');
  };

  const handleAccept = () => {
    updateInvoiceStatus(selectedInvoice.id, 'Accepted');
    showToast('Invoice accepted', 'success');
    setSelectedInvoice(null);
  };

  const handleReject = () => {
    updateInvoiceStatus(selectedInvoice.id, 'Rejected');
    showToast('Invoice rejected', 'info');
    setSelectedInvoice(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant/20"
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
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedInvoice.status)}`}>
              {selectedInvoice.status}
            </span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Reference</span>
            <span className="font-medium text-on-surface">{selectedInvoice.reference}</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-outline-variant/10">
            <span className="text-on-surface-variant">Buyer</span>
            <span className="font-medium text-on-surface">{selectedInvoice.buyer}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Seller</span>
            <span className="font-medium text-on-surface">{selectedInvoice.seller}</span>
          </div>
          
          <div className="pt-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {selectedInvoice.type === 'received' && selectedInvoice.status === 'Pending Acceptance' && (
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    className="flex-1 bg-red-50 text-red-700 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAccept}
                    className="flex-[2] bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Accept Invoice
                  </button>
                </div>
              )}

              {selectedInvoice.type === 'received' && selectedInvoice.status === 'Accepted' && (
                <button
                  onClick={() => {
                    setSelectedInvoice(null);
                    navigate('/payments', { state: { invoiceId: selectedInvoice.id } });
                  }}
                  className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Pay Now
                </button>
              )}

              {selectedInvoice.type === 'sent' && selectedInvoice.status === 'Pending Acceptance' && (
                <button
                  onClick={handleRemindBuyer}
                  className="w-full bg-surface-container-low text-on-surface font-bold py-3 rounded-xl hover:bg-surface-container-high transition-colors"
                >
                  Remind Buyer
                </button>
              )}

              <button
                onClick={handleDownload}
                className="w-full bg-surface-container-low text-on-surface font-bold py-3 rounded-xl hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
