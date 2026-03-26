import { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, Info, PlusCircle, CreditCard, Landmark, Package, Wrench, Eye, EyeOff, Plus, ArrowRight, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InvoiceItem from '../InvoiceItem';
import { Invoice } from '../../data/mockData';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

const PAYMENT_MODES = [
  {
    id: 'debit',
    title: 'Payment by Debit',
    description: 'Pay instantly via debit card or bank transfer',
    icon: CreditCard,
    bgClass: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30',
    iconClass: 'bg-blue-500 text-white shadow-sm shadow-blue-500/30'
  },
  {
    id: 'loan',
    title: 'Payment by Loan',
    description: 'Access quick loans from Nigerian lending partners to settle your bills',
    icon: Landmark,
    bgClass: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30',
    iconClass: 'bg-purple-500 text-white shadow-sm shadow-purple-500/30'
  },
  {
    id: 'goods',
    title: 'Payment by Goods',
    description: 'Settle invoices by trading inventory or products at market value',
    icon: Package,
    bgClass: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800/30',
    iconClass: 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
  },
  {
    id: 'skills',
    title: 'Payment by Skills',
    description: 'Repay by offering professional services or manual labor',
    icon: Wrench,
    bgClass: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-800/30',
    iconClass: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
  }
];

export function DashboardHeader({ userName, onCreateInvoice }: { userName: string, onCreateInvoice: () => void }) {
  return (
    <section className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="font-headline font-extrabold tracking-tight text-on-surface mb-2 text-3xl">Welcome, {userName.split(' ')[0]}</h1>
        <p className="text-on-surface-variant text-base">Track your credit score and manage invoices</p>
      </div>
      <button
        onClick={onCreateInvoice}
        className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
      >
        <PlusCircle className="w-4 h-4" />
        Create Invoice
      </button>
    </section>
  );
}

export function OutstandingCreditCard({ amount, isVisible, onToggleVisibility, onAddCredit, onRepay, nextPayment }: any) {
  return (
    <div 
      onClick={amount > 0 ? onRepay : onAddCredit}
      className={`rounded-2xl p-6 flex flex-col justify-between bg-primary shadow-lg shadow-primary/20 relative overflow-hidden transition-all group ${amount > 0 ? 'cursor-pointer hover:shadow-primary/40' : ''}`}
    >
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <p className="text-sm font-label text-white/80 uppercase tracking-widest">Outstanding Credit</p>
          <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="text-white/80 hover:text-white transition-colors">
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); amount > 0 ? onRepay() : onAddCredit(); }}
          className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-sm backdrop-blur-sm hover:bg-white/30 transition-colors"
          title={amount > 0 ? "Repay Credit" : "Add Manual Credit"}
        >
          {amount > 0 ? <Wallet className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </div>
      <div className="flex items-end justify-between relative z-10 mb-4">
        <h3 className="text-4xl font-bold font-headline text-white tracking-tight">
          {isVisible ? `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '••••••••'}
        </h3>
      </div>
      {nextPayment && isVisible && (
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-white/10 group-hover:bg-white/20 transition-all">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/80" />
            <span className="text-xs text-white/90 font-medium">
              Next Payment: <strong className="text-white">₦{nextPayment.outstandingBalance.toLocaleString()}</strong> due <strong className="text-white">{nextPayment.dueDate}</strong>
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
        </div>
      )}
    </div>
  );
}

export function CredTurnScoreCard({ score, onOpenModal, onIncreaseScore }: any) {
  return (
    <div
      onClick={onOpenModal}
      className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/15 relative overflow-hidden cursor-pointer hover:border-primary/30 transition-colors group"
    >
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <h2 className="font-headline text-xl font-bold text-on-surface">Your CredTurn Score</h2>
          <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
            <Info className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-extrabold font-headline tracking-tighter text-primary">{score}</span>
              <span className="text-on-surface-variant text-xl font-medium">/ 100</span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 bg-primary-container/20 text-on-primary-container px-4 py-1.5 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-sm font-bold font-label">{score >= 70 ? 'High Trust' : score >= 50 ? 'Medium Trust' : 'Low Trust'}</span>
            </div>
          </div>
          {/* Visual Indicator (Gauge) */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-surface-container-high" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (score / 100))} strokeLinecap="round" className="text-primary drop-shadow-md transition-all duration-1000 ease-out" />
            </svg>
            <ShieldCheck className="absolute text-primary w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-surface-container-low rounded-xl group-hover:bg-primary/5 transition-colors mb-6">
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium">Your score reflects your reliability in the Nigerian market. Keep paying on time!</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onIncreaseScore();
          }}
          className="w-full bg-primary/10 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 text-sm"
        >
          Increase CredTurn Score
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function PaymentModesCarousel({ onSelect }: { onSelect: () => void }) {
  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentModeIndex((prev) => (prev + 1) % PAYMENT_MODES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 relative overflow-hidden h-48 cursor-pointer group"
      onClick={onSelect}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={currentModeIndex}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`absolute inset-0 p-6 flex items-center gap-6 border-l-4 ${PAYMENT_MODES[currentModeIndex].bgClass}`}
        >
          <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${PAYMENT_MODES[currentModeIndex].iconClass}`}>
            {(() => {
              const Icon = PAYMENT_MODES[currentModeIndex].icon;
              return <Icon className="w-7 h-7" />;
            })()}
          </div>
          <div className="flex-grow">
            <h3 className="font-headline text-xl font-bold text-on-surface mb-1">
              {PAYMENT_MODES[currentModeIndex].title}
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
              {PAYMENT_MODES[currentModeIndex].description}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
        </motion.div>
      </AnimatePresence>
     
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {PAYMENT_MODES.map((mode, index) => (
          <button
            key={mode.id}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentModeIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentModeIndex ? 'bg-primary w-4' : 'bg-outline-variant/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function InvoiceListCard({ title, invoices, onViewAll, onSelectInvoice, showToast, onPayAction }: any) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/15 flex flex-col h-fit">
      <div className="px-8 py-6 border-b border-surface-container-low flex justify-between items-center">
        <h2 className="font-headline text-lg font-bold">{title}</h2>
        <button onClick={onViewAll} className="text-primary text-sm font-bold hover:underline">View All</button>
      </div>
      <div className="divide-y divide-surface-container-low">
        {invoices.map((invoice: Invoice) => (
          <InvoiceItem
            key={invoice.id}
            type={invoice.type}
            name={invoice.type === 'sent' ? invoice.buyer : invoice.seller}
            reference={invoice.reference}
            amount={`₦${invoice.amount.toLocaleString()}`}
            status={invoice.status}
            isManualEntry={invoice.isManualEntry}
            onClick={() => onSelectInvoice(invoice)}
            onDownload={(e) => {
              e.stopPropagation();
              generateInvoicePDF(invoice);
              if (showToast) showToast('Invoice downloaded successfully', 'success');
            }}
            showPayButton={invoice.type === 'received' && ['Accepted', 'Unpaid', 'Partially Paid', 'Overdue'].includes(invoice.status)}
            onPay={onPayAction ? (e) => onPayAction(e, invoice.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
}