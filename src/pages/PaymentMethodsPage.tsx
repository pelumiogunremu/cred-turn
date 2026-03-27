import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Building2, Smartphone, Plus, Lock, Sparkles } from 'lucide-react';

const SAVED_METHODS = [
  { id: '1', type: 'Debit Card', label: 'Access Bank •••• 4521', icon: CreditCard, color: 'bg-blue-500' },
  { id: '2', type: 'Bank Transfer', label: 'GTBank •••• 8834', icon: Building2, color: 'bg-orange-500' },
];

export default function PaymentMethodsPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
      <div className="ct-page-header">
        <button onClick={() => navigate(-1)} className="ct-btn-back"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold font-headline text-on-surface">Payment Methods</h1>
          <p className="text-sm text-on-surface-variant">Manage your saved payment options</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Saved methods */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Saved Methods</p>
          </div>
          {SAVED_METHODS.map(({ id, type, label, icon: Icon, color }) => (
            <div key={id} className="flex items-center gap-4 px-5 py-4 border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">{type}</p>
                <p className="text-xs text-on-surface-variant">{label}</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Active</span>
            </div>
          ))}
        </div>

        {/* Add new */}
        <div className="bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant/30 p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <p className="font-bold text-on-surface mb-1">Add Payment Method</p>
          <p className="text-xs text-on-surface-variant mb-4">Debit card, bank transfer, or virtual account</p>
          <button className="ct-btn-primary">
            <Plus className="w-4 h-4" /> Add Method
          </button>
        </div>

        {/* Interswitch security note */}
        <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl p-4">
          <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-0.5">Secured by Interswitch</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              All payment methods are encrypted and processed securely through Interswitch's PCI-DSS compliant gateway.
            </p>
          </div>
        </div>

        {/* Coming soon payment via goods */}
        <div className="bg-surface-container-lowest rounded-2xl border border-primary/20 p-5 flex items-center gap-4 group hover:border-primary/40 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-on-surface">Payment via Goods</p>
            <p className="text-xs text-on-surface-variant">Settle invoices by trading inventory</p>
          </div>
          <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Launching Next Month
          </span>
        </div>
      </motion.div>
    </main>
  );
}
