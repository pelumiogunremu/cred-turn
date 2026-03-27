import { motion } from 'motion/react';
import { X, CreditCard } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function PaymentModal() {
  const { selectedPayment, setSelectedPayment } = useAppContext();

  if (!selectedPayment) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-headline">Payment Info</h2>
          <button onClick={() => setSelectedPayment(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-on-surface">{selectedPayment.title}</h3>
            <p className="text-sm text-on-surface-variant">Transaction ID: TXN-{Math.floor(Math.random() * 1000000)}</p>
          </div>
          <div className="bg-surface-container-low p-4 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Date</span>
              <span className="font-bold">{new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Method</span>
              <span className="font-bold">Direct Debit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Status</span>
              <span className="text-emerald-600 font-bold">Successful</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedPayment(null)}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
