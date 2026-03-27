import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, Send, Clock, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

export default function InvoiceSentModal() {
  const { invoiceSentData, setInvoiceSentData, invoices } = useAppContext();
  const [wasAccepted, setWasAccepted] = useState(false);

  // Watch the invoice status in the global invoices list for real-time seller feedback
  useEffect(() => {
    if (!invoiceSentData) {
      setWasAccepted(false);
      return;
    }
    // Find the sent invoice in the list and check if it got accepted
    const liveInvoice = invoices.find(inv => inv.id === invoiceSentData.id);
    if (liveInvoice?.status === 'Not Due') {
      setWasAccepted(true);
    }
  }, [invoices, invoiceSentData]);

  if (!invoiceSentData) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-surface-container-lowest rounded-[2rem] p-6 sm:p-8 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/20 text-center relative"
      >
        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${wasAccepted ? 'bg-emerald-500' : 'bg-primary'}`} />

        <button
          onClick={() => setInvoiceSentData(null)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          {wasAccepted ? (
            /* ── SELLER — Invoice was Accepted! ── */
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="pt-4"
            >
              <div className="mb-6 flex justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Invoice Accepted! 🎉</h2>
              <p className="text-on-surface-variant mb-6">
                <span className="font-bold text-on-surface">{invoiceSentData.buyer}</span> has accepted your invoice for{' '}
                <span className="font-bold text-on-surface">₦{invoiceSentData.amount.toLocaleString()}</span>.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Reference</span>
                  <span className="font-mono font-medium text-on-surface">{invoiceSentData.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="font-bold text-emerald-600">Accepted ✓</span>
                </div>
              </div>

              <button
                onClick={() => setInvoiceSentData(null)}
                className="ct-btn-primary"
              >
                Great, Got it!
              </button>
              <p className="mt-4 text-xs text-on-surface-variant">
                You'll be notified when payment is made.
              </p>
            </motion.div>
          ) : (
            /* ── SELLER — Awaiting Acceptance ── */
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4"
            >
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg shadow-primary/30"
                  >
                    <Send className="w-6 h-6" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 border-2 border-primary rounded-full"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Invoice Sent!</h2>
              <p className="text-on-surface-variant mb-6">
                Your invoice for <span className="font-bold text-on-surface">₦{invoiceSentData.amount.toLocaleString()}</span> has been sent to{' '}
                <span className="font-bold text-on-surface">{invoiceSentData.buyer}</span>.
              </p>

              <div className="bg-surface-container-low rounded-2xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Reference</span>
                  <span className="font-mono font-medium text-on-surface">{invoiceSentData.reference}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Status</span>
                  <span className="text-primary font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Awaiting Acceptance
                  </span>
                </div>
              </div>

              {/* Live-watching indicator */}
              <div className="flex items-center justify-center gap-2 mb-6 text-xs text-on-surface-variant font-medium bg-surface-container-low rounded-xl py-2 px-4">
                <Bell className="w-3.5 h-3.5 text-primary" />
                This screen updates when buyer accepts
              </div>

              <button
                onClick={() => setInvoiceSentData(null)}
                className="ct-btn-primary"
              >
                Got it
              </button>
              <p className="mt-4 text-xs text-on-surface-variant">
                You'll be notified once they accept or pay.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
