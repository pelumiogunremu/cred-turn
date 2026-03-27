import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, HelpCircle, MessageSquare, Mail, ChevronDown, Phone, ExternalLink } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I create an invoice?',
    a: 'Go to the Dashboard and click "Create Invoice". Fill in the client\'s details, add line items, set a due date, and click "Send Invoice".',
  },
  {
    q: 'What happens after I send an invoice?',
    a: 'Your client receives the invoice and has 5 minutes to accept or reject it. You\'ll see their response in real-time on your Dashboard.',
  },
  {
    q: 'How is my CredTurn Score calculated?',
    a: 'Your score goes up when you pay invoices on time (+8 pts), clear full balances (+5 pts), or repay loans (+3 pts). Late payments and expired invoices reduce your score.',
  },
  {
    q: 'Can I pay with a loan?',
    a: 'Yes! If an invoice is Almost Due, Due, or Overdue, you\'ll see "Pay with Loan" on the payments page. Choose a lending partner and they\'ll settle it for you.',
  },
  {
    q: 'How do I record a cash payment?',
    a: 'On any invoice you created, open it and click "Paid with Cash". This instantly marks the invoice as Paid without going through the digital payment flow.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Yes. All digital payments go through Interswitch, which is PCI-DSS compliant. CredTurn never stores your card details.',
  },
];

export default function HelpPage() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
      <div className="ct-page-header">
        <button onClick={() => navigate(-1)} className="ct-btn-back"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold font-headline text-on-surface">Help & Support</h1>
          <p className="text-sm text-on-surface-variant">Get answers and contact us</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Contact options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Live Chat', icon: MessageSquare, action: () => showToast('Live chat starting soon! 💬', 'info') },
            { label: 'Send Email', icon: Mail, action: () => showToast('Opening email client...', 'info') },
            { label: 'Call Us', icon: Phone, action: () => showToast('Opening phone app...', 'info') },
            { label: 'Raise Ticket', icon: ExternalLink, action: () => showToast('Opening support portal...', 'info') },
          ].map(({ label, icon: Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="bg-surface-container-lowest border border-outline-variant/15 rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-on-surface">{label}</span>
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Frequently Asked Questions</p>
          </div>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} className="border-b border-outline-variant/10 last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
              >
                <span className="text-sm font-bold text-on-surface">{q}</span>
                <ChevronDown className={`w-4 h-4 text-primary shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-on-surface-variant leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant text-center">
          CredTurn Support — <span className="text-primary font-bold">support@credturn.ng</span>
        </p>
      </motion.div>
    </main>
  );
}
