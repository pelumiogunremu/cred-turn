import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, CheckCircle2, AlertCircle, FileText, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

type ModalStep = 'confirm' | 'accepted' | 'rejected' | 'expired';

export default function IncomingInvoiceModal() {
  const navigate = useNavigate();
  const { incomingInvoice, setIncomingInvoice, addInvoice, showToast, userProfile } = useAppContext();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [step, setStep] = useState<ModalStep>('confirm');

  // If the logged-in user created this invoice, don't show the buyer popup to them
  const isCreator = incomingInvoice?.creatorEmail === userProfile?.email;

  // Reset step whenever a new invoice arrives
  useEffect(() => {
    if (incomingInvoice) setStep('confirm');
  }, [incomingInvoice?.id]);

  useEffect(() => {
    if (!incomingInvoice || !incomingInvoice.expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((incomingInvoice.expiresAt! - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0 && incomingInvoice.status === 'Pending') {
        const expiredInvoice = { ...incomingInvoice, status: 'Expired' as const, outstandingBalance: 0 };
        setIncomingInvoice(expiredInvoice);
        addInvoice(expiredInvoice);
        setStep('expired');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [incomingInvoice, setIncomingInvoice]);

  // Auto-close after showing accepted/rejected/expired result
  useEffect(() => {
    if (step === 'accepted' || step === 'rejected' || step === 'expired') {
      const timer = setTimeout(() => {
        setIncomingInvoice(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, setIncomingInvoice]);

  if (!incomingInvoice || isCreator) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    const acceptedInvoice = { ...incomingInvoice, status: 'Not Due' as const };
    addInvoice(acceptedInvoice);
    setStep('accepted');
    // Simulate seller notification
    showToast(`${incomingInvoice.seller} has been notified of your acceptance`, 'success');
  };

  const handleReject = () => {
    const rejectedInvoice = { ...incomingInvoice, status: 'Rejected' as const, outstandingBalance: 0 };
    addInvoice(rejectedInvoice);
    setStep('rejected');
    showToast(`${incomingInvoice.seller} has been notified`, 'info');
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-surface-container-lowest rounded-[2.5rem] p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/20 relative"
      >
        <AnimatePresence mode="wait">

          {/* ── CONFIRM STEP (default — buyer sees invoice details) ── */}
          {step === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button
                onClick={() => setIncomingInvoice(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center relative bg-primary/10 text-primary">
                  <FileText className="w-10 h-10" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-on-primary rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-surface-container-lowest"
                  >
                    1
                  </motion.div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-headline text-on-surface mb-1">New Invoice Received</h2>
                <p className="text-on-surface-variant">
                  From <span className="font-bold text-on-surface">{incomingInvoice.seller}</span>
                </p>
              </div>

              {/* Invoice Summary */}
              <div className="bg-surface-container-low rounded-3xl p-6 mb-6 border border-outline-variant/10">
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
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Due Date</span>
                    <span className="font-medium text-on-surface">{incomingInvoice.dueDate}</span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 mb-6 text-primary font-bold">
                <Clock className="w-5 h-5" />
                <span>Accept within {formatTime(timeLeft)}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button onClick={handleAccept} className="ct-btn-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  Accept Invoice
                </button>
                <button onClick={handleReject} className="ct-btn-secondary">
                  Reject
                </button>
              </div>

              <p className="mt-6 text-center text-xs text-on-surface-variant px-4">
                By accepting, you agree to pay this invoice by the due date.
              </p>
            </motion.div>
          )}

          {/* ── ACCEPTED STEP ── */}
          {step === 'accepted' && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </motion.div>

              <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Invoice Accepted!</h2>
              <p className="text-on-surface-variant mb-6">
                You accepted the invoice from <span className="font-bold text-on-surface">{incomingInvoice.seller}</span>.
              </p>

              <div className="bg-surface-container-low rounded-2xl p-5 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Amount</span>
                  <span className="font-bold text-on-surface">₦{incomingInvoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Reference</span>
                  <span className="font-mono text-on-surface">{incomingInvoice.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="font-bold text-emerald-600">Accepted</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant mb-2">
                ✅ {incomingInvoice.seller} has been notified. You can pay now or close.
              </p>

              {/* Pay Now button on accepted step — goes to the specific invoice payment */}
              <button
                onClick={() => {
                  setIncomingInvoice(null);
                  navigate('/payments', { state: { invoiceId: incomingInvoice.id } });
                }}
                className="ct-btn-primary mb-3"
              >
                Pay Now
              </button>

              <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}

          {/* ── REJECTED STEP ── */}
          {step === 'rejected' && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <XCircle className="w-12 h-12 text-red-500" />
              </motion.div>

              <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Invoice Rejected</h2>
              <p className="text-on-surface-variant mb-6">
                You rejected the invoice from <span className="font-bold text-on-surface">{incomingInvoice.seller}</span>.
              </p>

              <div className="bg-surface-container-low rounded-2xl p-5 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Reference</span>
                  <span className="font-mono text-on-surface">{incomingInvoice.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="font-bold text-red-600">Rejected</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant mb-2">
                ✅ {incomingInvoice.seller} has been notified of the rejection.
              </p>
              <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-red-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}

          {/* ── EXPIRED STEP ── */}
          {step === 'expired' && (
            <motion.div
              key="expired"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-12 h-12 text-on-surface-variant/60" />
              </div>

              <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Invoice Expired</h2>
              <p className="text-on-surface-variant mb-6">
                The invoice from <span className="font-bold text-on-surface">{incomingInvoice.seller}</span> has expired. No action was taken.
              </p>

              <div className="bg-surface-container-low rounded-2xl p-5 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Reference</span>
                  <span className="font-mono text-on-surface">{incomingInvoice.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="font-bold text-on-surface-variant">Expired</span>
                </div>
              </div>

              <button onClick={() => setIncomingInvoice(null)} className="ct-btn-secondary">
                Close
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
