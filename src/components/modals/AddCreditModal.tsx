import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface AddCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: string, desc: string) => void;
}

export default function AddCreditModal({ isOpen, onClose, onSave }: AddCreditModalProps) {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDesc('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-headline">Add Credit Manually</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">Enter amount you owe</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:border-primary transition-colors font-bold"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">Add description (optional)</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Loan from John"
            />
          </div>
          <button
            onClick={() => onSave(amount, desc)}
            disabled={!amount}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-2 disabled:opacity-50"
          >
            Save Credit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
