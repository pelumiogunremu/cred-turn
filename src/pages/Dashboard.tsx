import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Invoice } from '../data/mockData';
import { useAppContext } from '../context/AppContext';
import AddCreditModal from '../components/modals/AddCreditModal';
import { 
  DashboardHeader, 
  OutstandingCreditCard, 
  CredTurnScoreCard, 
  PaymentModesCarousel, 
  InvoiceListCard 
} from '../components/dashboard/DashboardSections';

export default function Dashboard() {
  const navigate = useNavigate();
  const { 
    credTurnScore, 
    setSelectedInvoice, 
    setIsScoreModalOpen,
    userProfile,
    invoices,
    setInvoices,
    showToast,
    setIncomingInvoice
  } = useAppContext();
  
  const [currentModeIndex, setCurrentModeIndex] = useState(0);

  // FEATURE: Simulated Login Invoice Intercept (One-time per session)
  useEffect(() => {
    const hasShown = sessionStorage.getItem('credturn_hasShownStartupInvoice');
    if (!hasShown) {
      sessionStorage.setItem('credturn_hasShownStartupInvoice', 'true');
      const businesses = [
        { name: 'Emeka Wholesalers', desc: 'Q3 Restock Supplies', category: 'Inventory' },
        { name: 'Mama Joy Trading', desc: 'Bulk Rice & Flour', category: 'Food & Beverage' },
        { name: 'Chinedu Electronics', desc: 'Office HVAC Repair', category: 'Maintenance' },
        { name: 'Alaba Market Supplies', desc: 'Generator Servicing', category: 'Equipment' },
        { name: 'Iya Basira Foods', desc: 'Weekly Catering', category: 'Food & Beverage' }
      ];
      const biz = businesses[Math.floor(Math.random() * businesses.length)];
      const randomAmt = Math.floor(Math.random() * 800000) + 15000;

      setTimeout(() => {
        setIncomingInvoice({
          id: `inc-${Date.now()}`,
          name: biz.desc,
          reference: `INV-${Math.floor(Math.random() * 90000) + 10000}`,
          amount: randomAmt,
          outstandingBalance: randomAmt,
          status: 'Pending',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          category: biz.category,
          buyer: userProfile.name,
          seller: biz.name,
          type: 'received',
          expiresAt: Date.now() + 60000 // 1 minute to accept
        });
      }, 1500); // Wait 1.5 seconds after dashboard load
    }
  }, [setIncomingInvoice, userProfile.name]);


  const [isCreditVisible, setIsCreditVisible] = useState(true);
  const [isAddCreditModalOpen, setIsAddCreditModalOpen] = useState(false);
  const [creditAmountInput, setCreditAmountInput] = useState('');
  const [creditDescInput, setCreditDescInput] = useState('');

  // Calculate Outstanding Credit dynamically: sum of unpaid/partially paid received invoices
  const outstandingCredit = invoices
    .filter(inv => inv.type === 'received' && ['Pending', 'Not Due', 'Due', 'Overdue', 'Partially Paid'].includes(inv.status))
    .reduce((sum, inv) => sum + inv.outstandingBalance, 0);

  // Find the earliest due invoice
  const nextPayment = invoices
    .filter(inv => inv.type === 'received' && ['Not Due', 'Due', 'Partially Paid', 'Overdue'].includes(inv.status))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const invoicesCreated = invoices.filter(inv => inv.type === 'sent').slice(0, 4);
  const invoicesReceived = invoices.filter(inv => inv.type === 'received').slice(0, 4);


  const handleAddCredit = (amount: string, desc: string) => {
    if (amount) {
      const newInvoice: Invoice = {
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: desc || 'Manual Entry',
        reference: `MAN-${Math.floor(Math.random() * 10000)}`,
        amount: parseFloat(amount),
        outstandingBalance: parseFloat(amount),
        status: 'Due',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: 'Self-reported credit',
        buyer: userProfile.name,
        seller: desc || 'Unknown Creditor',
        type: 'received', // FIX m3: Manual credits are money owed (received invoices)
        isManualEntry: true,
        contributesToScore: false
      };
      setInvoices([newInvoice, ...invoices]);
      setIsAddCreditModalOpen(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8 pb-32">
      <DashboardHeader userName={userProfile.name} onCreateInvoice={() => navigate('/invoice/new')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <OutstandingCreditCard 
            amount={outstandingCredit} 
            isVisible={isCreditVisible} 
            onToggleVisibility={() => setIsCreditVisible(!isCreditVisible)}
            onAddCredit={() => setIsAddCreditModalOpen(true)}
            onRepay={() => navigate('/transactions', { state: { tab: 'received' } })}
            onGoToCard={() => navigate('/card')}
            onPayNow={(invoiceId: string) => navigate('/payments', { state: { invoiceId } })}
            nextPayment={nextPayment}
          />
          <CredTurnScoreCard 
            score={credTurnScore} 
            onOpenModal={() => setIsScoreModalOpen(true)} 
            onIncreaseScore={() => navigate('/payments')}
          />
          <PaymentModesCarousel onNavigateToPayments={() => navigate('/payments')} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <InvoiceListCard 
            title="Invoices Created" 
            invoices={invoicesCreated} 
            onViewAll={() => navigate('/transactions', { state: { tab: 'created' } })}
            onSelectInvoice={setSelectedInvoice}
            showToast={showToast}
          />
          <InvoiceListCard 
            title="Invoices Received" 
            invoices={invoicesReceived} 
            onViewAll={() => navigate('/transactions', { state: { tab: 'received' } })}
            onSelectInvoice={setSelectedInvoice}
            showToast={showToast}
            onPayAction={(e: React.MouseEvent, id: string) => {
              e.stopPropagation();
              navigate('/payments', { state: { invoiceId: id } });
            }}
          />
        </div>
      </div>

      <AddCreditModal 
        isOpen={isAddCreditModalOpen} 
        onClose={() => setIsAddCreditModalOpen(false)} 
        onSave={handleAddCredit} 
      />
    </main>
  );
}
