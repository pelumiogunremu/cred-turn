import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function IncomingInvoiceModal() {
  const { incomingInvoice, setIncomingInvoice, updateInvoiceStatus } = useAppContext();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!incomingInvoice || !incomingInvoice.expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((incomingInvoice.expiresAt! - now) / 1000));
      setTimeLeft(diff);
      
      if (diff === 0 && incomingInvoice.status === 'Pending Acceptance') {
        // Status update is handled by AppContext's global timer, 
        // but we can update local state for immediate feedback
        setIncomingInvoice(prev => prev ? { ...prev, status: 'Expired' } : null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [incomingInvoice, setIncomingInvoice]);

  if (!incomingInvoice) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    updateInvoiceStatus(incomingInvoice.id, 'Accepted');
    setIncomingInvoice(null);
  };

  const handleReject = () => {
    updateInvoiceStatus(incomingInvoice.id, 'Rejected');
    setIncomingInvoice(null);
  };

  const isExpired = incomingInvoice.status === 'Expired' || timeLeft === 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-surface-container-lowest rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-outline-variant/20 relative overflow-hidden"
      >
        {/* Header with Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center relative ${isExpired ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
            <FileText className="w-10 h-10" />
            {!isExpired && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface-container-lowest"
              >
                1
              </motion.div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIncomingInvoice(null)} 
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">
            {isExpired ? 'Invoice Expired' : 'New Invoice Received'}
          </h2>
          <p className="text-on-surface-variant">
            From <span className="font-bold text-on-surface">{incomingInvoice.seller}</span>
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-surface-container-low rounded-3xl p-6 mb-8 border border-outline-variant/10">
          <div className="flex justify-between items-center mb-4">
            <span className="text-on-surface-variant text-sm">Amount Due</span>
            <span className="text-2xl font-bold text-on-surface">₦{incomingInvoice.amount.toLocaleString()}</span>
          </div>
          <div className="space-y-3 pt-4 border-t border-outline-variant/10">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Description</span>
              <span className="font-medium text-on-surface">{incomingInvoice.description}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Reference</span>
              <span className="font-mono text-on-surface">{incomingInvoice.reference}</span>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        {!isExpired && (
          <div className="flex items-center justify-center gap-2 mb-8 text-primary font-bold">
            <Clock className="w-5 h-5" />
            <span>Accept within {formatTime(timeLeft)}</span>
          </div>
        )}

        {isExpired && (
          <div className="flex items-center justify-center gap-2 mb-8 text-red-600 font-bold">
            <AlertCircle className="w-5 h-5" />
            <span>This invoice has expired.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!isExpired ? (
            <>
              <button
                onClick={handleAccept}
                className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                Accept Invoice
              </button>
              <button
                onClick={handleReject}
                className="w-full bg-surface-container-low text-on-surface font-bold py-4 rounded-2xl hover:bg-surface-container-high transition-all active:scale-[0.98]"
              >
                Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => setIncomingInvoice(null)}
              className="w-full bg-surface-container-low text-on-surface font-bold py-4 rounded-2xl hover:bg-surface-container-high transition-all active:scale-[0.98]"
            >
              Close
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-on-surface-variant px-4">
          By accepting, you agree to pay this invoice by the due date.
        </p>
      </motion.div>
    </div>
  );
}
