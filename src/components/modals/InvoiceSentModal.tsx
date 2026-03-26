import { motion } from 'motion/react';
import { CheckCircle2, X, Send } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function InvoiceSentModal() {
  const { invoiceSentData, setInvoiceSentData } = useAppContext();

  if (!invoiceSentData) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-surface-container-lowest rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-outline-variant/20 text-center relative overflow-hidden"
      >
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        
        <button 
          onClick={() => setInvoiceSentData(null)} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

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
          Your invoice for <span className="font-bold text-on-surface">₦{invoiceSentData.amount.toLocaleString()}</span> has been sent to <span className="font-bold text-on-surface">{invoiceSentData.buyer}</span>.
        </p>

        <div className="bg-surface-container-low rounded-2xl p-4 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Reference</span>
            <span className="font-mono font-medium text-on-surface">{invoiceSentData.reference}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Status</span>
            <span className="text-primary font-bold">Awaiting Acceptance</span>
          </div>
        </div>

        <button
          onClick={() => setInvoiceSentData(null)}
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          Got it
        </button>
        
        <p className="mt-4 text-xs text-on-surface-variant">
          You'll be notified once they accept or pay.
        </p>
      </motion.div>
    </div>
  );
}
