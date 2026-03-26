import { CreditCard, ChevronRight, AlertCircle, Wallet, Package, Wrench, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Invoice } from '../../data/mockData';

export function SelectInvoiceStep({ pendingInvoices, onSelect }: { pendingInvoices: Invoice[], onSelect: (inv: Invoice) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15">
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 mb-4">Select Invoice to Pay</h2>
        
        {pendingInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">All Caught Up!</h3>
            <p className="text-sm text-on-surface-variant">You have no pending invoices to pay at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvoices.map(inv => (
              <button
                key={inv.id}
                onClick={() => onSelect(inv)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-outline-variant/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:text-primary">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-on-surface">{inv.name}</p>
                      {inv.isManualEntry && (
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Manual Entry</span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant">{inv.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-on-surface">${inv.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold uppercase ${inv.status === 'Overdue' ? 'text-error' : 'text-orange-600'}`}>
                    {inv.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmPaymentStep({ selectedInvoice, isProcessing, onAttempt, onCancel }: { selectedInvoice: Invoice | null, isProcessing: boolean, onAttempt: () => void, onCancel: () => void }) {
  return (
    <div className="space-y-8">
      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/15 text-center shadow-sm">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Confirm Payment</h2>
        <p className="text-on-surface-variant mb-8">You are about to pay <span className="font-bold text-on-surface">{selectedInvoice?.name}</span></p>
        
        <div className="bg-surface-container-low p-6 rounded-2xl mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-on-surface-variant text-sm">Amount Due</span>
            <span className="text-2xl font-extrabold text-on-surface">${selectedInvoice?.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant text-sm">Payment Method</span>
            <span className="font-bold text-primary flex items-center gap-1">CredTurn Balance <ChevronRight className="w-4 h-4" /></span>
          </div>
        </div>

        <button
          onClick={onAttempt}
          disabled={isProcessing}
          className="w-full bg-primary text-on-primary font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>
        <button 
          onClick={onCancel}
          className="mt-4 text-on-surface-variant font-bold text-sm hover:text-on-surface"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export function FallbackOptionsStep({ isProcessing, onSelectFallback }: { isProcessing: boolean, onSelectFallback: (type: 'Loan' | 'Goods' | 'Skills') => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-red-900">Insufficient Funds</h3>
          <p className="text-sm text-red-700">Your CredTurn balance is too low to complete this payment. Choose a fallback option to complete the transaction.</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant/70 px-2">Fallback Options</h2>
        
        <button
          onClick={() => onSelectFallback('Loan')}
          disabled={isProcessing}
          className="w-full bg-white p-6 rounded-2xl border border-outline-variant/15 flex items-center justify-between hover:border-primary/40 hover:shadow-md transition-all text-left group relative overflow-hidden"
        >
          <div className={`flex items-center gap-5 transition-opacity ${isProcessing ? 'opacity-50' : ''}`}>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Wallet className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface text-lg">Instant Loan</h4>
              <p className="text-sm text-on-surface-variant">Get a micro-loan to cover this invoice. 0% interest for 7 days.</p>
            </div>
          </div>
          {isProcessing ? (
            <div className="absolute right-6 w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          ) : (
            <ChevronRight className="w-6 h-6 text-on-surface-variant" />
          )}
        </button>

        <button
          disabled
          className="w-full bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between opacity-60 cursor-not-allowed text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-on-surface-variant">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-on-surface text-lg">Goods Exchange</h4>
                <span className="text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-bold uppercase">Coming Soon</span>
              </div>
              <p className="text-sm text-on-surface-variant">Exchange physical goods to settle this invoice.</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-on-surface-variant" />
        </button>

        <button
          disabled
          className="w-full bg-surface-container-low/50 p-6 rounded-2xl border border-outline-variant/10 flex items-center justify-between opacity-60 cursor-not-allowed text-left"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-surface-container-high rounded-2xl flex items-center justify-center text-on-surface-variant">
              <Wrench className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-on-surface text-lg">Skills Settlement</h4>
                <span className="text-[10px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-bold uppercase">Coming Soon</span>
              </div>
              <p className="text-sm text-on-surface-variant">Offer your professional services to settle the debt.</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-on-surface-variant" />
        </button>
      </div>
    </div>
  );
}

export function SuccessStep({ selectedInvoice, fallbackType, credTurnScore, onGoHome }: { selectedInvoice: Invoice | null, fallbackType: string | null, credTurnScore: number, onGoHome: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle2 className="w-16 h-16 text-primary" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full border-4 border-primary/20"
        ></motion.div>
      </div>
      
      <h2 className="text-3xl font-extrabold text-on-surface mb-3 font-headline tracking-tight">Payment Completed!</h2>
      <p className="text-on-surface-variant mb-10 max-w-xs mx-auto">
        Invoice for <span className="font-bold text-on-surface">{selectedInvoice?.name}</span> has been settled using <span className="font-bold text-primary">{fallbackType}</span>.
      </p>

      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 mb-10 max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-3 text-primary mb-2">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-bold uppercase tracking-widest text-xs">CredTurn Score Update</span>
        </div>
        <p className="text-on-surface-variant text-sm mb-4">Your score increased because you completed the transaction using a fallback instead of defaulting.</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-extrabold text-primary">{credTurnScore}</span>
          <span className="text-primary font-bold text-lg">+4</span>
        </div>
      </div>

      <button
        onClick={onGoHome}
        className="w-full max-w-xs bg-on-surface text-surface font-bold py-4 rounded-2xl hover:bg-on-surface/90 transition-all"
      >
        Back to Dashboard
      </button>
    </motion.div>
  );
}
