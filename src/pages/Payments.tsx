import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  CreditCard, 
  Building2, 
  Banknote, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Info,
  FileText
} from 'lucide-react';
import { Invoice } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import { invoiceService } from '../services/invoiceService';
import { paymentService } from '../services/paymentService';
import { loanService, LendingPartner } from '../services/loanService';

type PaymentStep = 'select' | 'context' | 'options' | 'debit_flow' | 'loan_flow' | 'success';

export default function Payments() {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoices, processPayment, processLoanPayment, userProfile, showToast } = useAppContext();
  
  const [step, setStep] = useState<PaymentStep>(location.state?.invoiceId ? 'context' : 'select');
  const [invoiceId, setInvoiceId] = useState<string | null>(location.state?.invoiceId || null);
  const [invoice, setInvoice] = useState(invoices.find(inv => inv.id === invoiceId));
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<LendingPartner | null>(null);

  useEffect(() => {
    if (invoiceId) {
      const inv = invoices.find(i => i.id === invoiceId);
      setInvoice(inv);
      if (inv) setPaymentAmount(inv.outstandingBalance);
    }
  }, [invoiceId, invoices]);

  const payableInvoices = invoices.filter(inv => 
    inv.type === 'received' && 
    ['Unpaid', 'Overdue', 'Partially Paid', 'Accepted'].includes(inv.status)
  );

  const handleSelectInvoice = (inv: Invoice) => {
    setInvoiceId(inv.id);
    setInvoice(inv);
    setPaymentAmount(inv.outstandingBalance);
    setStep('context');
  };

  const invoiceState = invoice ? invoiceService.getInvoiceState(invoice) : '';
  const lendingPartners = invoice ? loanService.getLendingPartners(invoice.outstandingBalance, invoiceState === 'Overdue') : [];

  const handleInterswitchPayment = async () => {
    if (!invoice) return;
    setIsProcessing(true);
    const result = await paymentService.initiateInterswitchPayment(
      paymentAmount,
      { name: userProfile.name, email: 'user@example.com' },
      invoice.id
    );
    
    setIsProcessing(false);
    if (result.success) {
      processPayment(invoice.id, paymentAmount, 'Debit Card');
      setStep('success');
    } else {
      setPaymentResult({ success: false, message: result.message });
    }
  };

  const handleLoanApplication = async (partner: LendingPartner) => {
    if (!invoice) return;
    setSelectedPartner(partner);
    setIsProcessing(true);
    const success = await loanService.applyForLoan(partner.id, invoice.outstandingBalance);
    setIsProcessing(false);
    
    if (success) {
      processLoanPayment(invoice.id, invoice.outstandingBalance, partner.name);
      setStep('success');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-32 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => {
            if (step === 'select') navigate(-1);
            else if (step === 'context') {
              if (location.state?.invoiceId) navigate(-1);
              else setStep('select');
            }
            else setStep('context');
          }}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">
          {step === 'select' ? 'Select Invoice' : 'Complete Payment'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold text-on-surface">Select Invoice to Pay</h3>
              <span className="text-xs font-bold text-on-surface-variant/60">{payableInvoices.length} Pending</span>
            </div>

            {payableInvoices.length > 0 ? (
              <div className="space-y-4">
                {payableInvoices.map((inv) => (
                  <button 
                    key={inv.id}
                    onClick={() => handleSelectInvoice(inv)}
                    className="w-full bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:border-primary hover:shadow-lg transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{inv.seller}</h4>
                        <p className="text-xs text-on-surface-variant">{inv.reference} • Due {inv.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-on-surface">₦{inv.outstandingBalance.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{inv.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-surface-container-lowest rounded-[2.5rem] border border-dashed border-outline-variant/30">
                <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <p className="text-on-surface-variant font-bold">No pending invoices</p>
                <p className="text-sm text-on-surface-variant/60">You're all caught up on your payments!</p>
              </div>
            )}
          </motion.div>
        )}

        {step === 'context' && invoice && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Invoice Summary Card */}
            <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Invoice Reference</p>
                  <h2 className="text-xl font-extrabold text-on-surface">{invoice.reference}</h2>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  invoiceState === 'Overdue' ? 'bg-red-100 text-red-700 border-red-200' :
                  invoiceState === 'Due' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                  'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  {invoiceState}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Seller</p>
                  <p className="font-bold text-on-surface">{invoice.seller}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Due Date</p>
                  <p className="font-bold text-on-surface">{invoice.dueDate}</p>
                </div>
              </div>

              {/* Payment Progress Tracker */}
              <div className="mb-8 bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Total Amount</p>
                    <p className="font-bold text-on-surface">₦{invoice.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-1">Still Outstanding</p>
                    <p className="font-bold text-primary">₦{invoice.outstandingBalance.toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${Math.max(0, 100 - (invoice.outstandingBalance / invoice.amount * 100))}%` }}
                  ></div>
                </div>
                
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600">
                    ₦{(invoice.amount - invoice.outstandingBalance).toLocaleString()} Paid So Far
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setStep('options')}
                className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Payment Options
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-xs text-blue-800 font-medium">
                Your payments are secured by Interswitch. CredTurn does not store your card details.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'options' && (
          <motion.div
            key="options"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <p className="text-sm font-bold text-on-surface-variant mb-2">Select Payment Method</p>
            
            {/* Option: Debit/Bank Transfer */}
            <button 
              onClick={() => setStep('debit_flow')}
              className="w-full bg-white p-6 rounded-3xl border border-outline-variant/20 flex items-center gap-4 hover:border-primary hover:shadow-lg transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-on-surface">Debit Card / Bank Transfer</h3>
                <p className="text-xs text-on-surface-variant">Instant confirmation via Interswitch</p>
              </div>
              <ArrowRight className="w-5 h-5 text-on-surface-variant" />
            </button>

            {/* Option: Pay with Loan (Conditional) */}
            {(invoiceState === 'Almost Due' || invoiceState === 'Due' || invoiceState === 'Overdue') && (
              <button 
                onClick={() => setStep('loan_flow')}
                className="w-full bg-white p-6 rounded-3xl border border-outline-variant/20 flex items-center gap-4 hover:border-primary hover:shadow-lg transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Banknote className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-on-surface">Pay with Loan</h3>
                    <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Low Interest</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">Get instant credit from our lending partners</p>
                </div>
                <ArrowRight className="w-5 h-5 text-on-surface-variant" />
              </button>
            )}

            {/* Option: Pay with Goods (Coming Soon) */}
            <button 
              onClick={() => showToast('Payment via Goods is launching next month!', 'info')}
              className="w-full bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 flex items-center gap-4 opacity-70 hover:opacity-100 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-on-surface">Pay with Goods</h3>
                  <span className="text-[9px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-bold uppercase">Coming Soon</span>
                </div>
                <p className="text-xs text-on-surface-variant">Exchange products to clear your debt</p>
              </div>
            </button>

            {/* Option: Pay with Services (Coming Soon) */}
            <button 
              onClick={() => showToast('Payment via Services is launching next month!', 'info')}
              className="w-full bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 flex items-center gap-4 opacity-70 hover:opacity-100 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low text-on-surface-variant flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-on-surface">Pay with Services</h3>
                  <span className="text-[9px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-bold uppercase">Coming Soon</span>
                </div>
                <p className="text-xs text-on-surface-variant">Offer your professional services as payment</p>
              </div>
            </button>
          </motion.div>
        )}

        {step === 'debit_flow' && invoice && (
          <motion.div
            key="debit_flow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-xl">
              <h3 className="text-xl font-extrabold text-on-surface mb-6">Enter Payment Amount</h3>
              
              <div className="space-y-4 mb-8">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-on-surface-variant">₦</span>
                  <input 
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-2xl py-5 pl-12 pr-6 text-3xl font-black text-on-surface outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPaymentAmount(invoice.outstandingBalance)}
                    className="flex-1 py-2 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    Pay Full (₦{invoice.outstandingBalance.toLocaleString()})
                  </button>
                  <button 
                    onClick={() => setPaymentAmount(invoice.outstandingBalance / 2)}
                    className="flex-1 py-2 rounded-xl bg-surface-container-low text-xs font-bold text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    Pay Half (₦{(invoice.outstandingBalance / 2).toLocaleString()})
                  </button>
                </div>
              </div>

              {paymentResult && !paymentResult.success && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-xs text-red-800 font-medium">{paymentResult.message}</p>
                </div>
              )}

              <button 
                disabled={isProcessing || paymentAmount <= 0 || paymentAmount > invoice.outstandingBalance}
                onClick={handleInterswitchPayment}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay with Interswitch
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'loan_flow' && invoice && (
          <motion.div
            key="loan_flow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-extrabold text-on-surface">Lending Partners</h3>
              <span className="text-xs font-bold text-on-surface-variant/60">₦{invoice.outstandingBalance.toLocaleString()} Needed</span>
            </div>

            <div className="space-y-4">
              {lendingPartners.map((partner) => (
                <div 
                  key={partner.id}
                  className="bg-white p-6 rounded-3xl border border-outline-variant/20 shadow-sm hover:border-blue-500 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{partner.name}</h4>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{partner.interestRate}% Interest</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-on-surface">₦{partner.monthlyEstimate.toLocaleString()}/mo</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase">{partner.duration} Months</p>
                    </div>
                  </div>
                  
                  <button 
                    disabled={isProcessing}
                    onClick={() => handleLoanApplication(partner)}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing && selectedPartner?.id === partner.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Applying...
                      </>
                    ) : (
                      'Apply & Pay Invoice'
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-low p-4 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-on-surface-variant shrink-0" />
              <p className="text-[10px] text-on-surface-variant/70 font-medium">
                Loan payments are sent directly to the seller. Your CredTurn score will be updated upon successful application.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-on-surface mb-4 font-headline tracking-tight">Payment Successful!</h2>
            <p className="text-on-surface-variant font-medium mb-12 max-w-xs mx-auto">
              Your payment for ₦{paymentAmount.toLocaleString()} has been processed and the seller has been notified.
            </p>
            
            <div className="bg-surface-container-low rounded-3xl p-6 mb-12 text-left space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-bold">Transaction ID</span>
                <span className="text-on-surface font-black">CT-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-bold">Amount Paid</span>
                <span className="text-emerald-600 font-black">₦{paymentAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant font-bold">Method</span>
                <span className="text-on-surface font-black">{selectedPartner ? `Loan (${selectedPartner.name})` : 'Debit Card'}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/transactions')}
              className="w-full bg-on-surface text-surface py-5 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all"
            >
              Back to Transactions
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
