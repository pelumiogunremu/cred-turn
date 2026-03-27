import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TransactionList from '../components/TransactionList';
import { 
  TransactionsHeader, 
  SummaryCard, 
  MiniInsights, 
  FilterControls, 
  FloatingActionButton 
} from '../components/transactions/TransactionSections';

type TabType = 'all' | 'created' | 'received';
type FilterType = 'All' | 'Pending' | 'Overdue' | 'Paid';

export default function Transactions() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedInvoice, invoices } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>((location.state as any)?.tab || 'all');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filteredInvoices = invoices.filter(inv => {
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'created' ? inv.type === 'sent' : 
      inv.type === 'received';
      
    const matchesFilter = activeFilter === 'All' || 
      (activeFilter === 'Pending' && ['Pending', 'Not Due', 'Due', 'Partially Paid'].includes(inv.status)) ||
      (activeFilter === 'Overdue' && inv.status === 'Overdue') ||
      (activeFilter === 'Paid' && inv.status === 'Paid');
      
    return matchesTab && matchesFilter;
  });

  // SummaryCard calculation: 
  // - If 'received', it matches Dashboard's Outstanding Credit (Outstanding Balance)
  // - Otherwise, it uses the sum of Face Value (amount) of the filtered list
  const totalAmount = activeTab === 'received'
    ? invoices
        .filter(inv => inv.type === 'received' && ['Pending', 'Not Due', 'Due', 'Overdue', 'Partially Paid'].includes(inv.status))
        .reduce((sum, inv) => sum + inv.outstandingBalance, 0)
    : filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const pendingCount = filteredInvoices.filter(inv => ['Pending', 'Not Due', 'Due', 'Partially Paid'].includes(inv.status)).length;
  const overdueCount = filteredInvoices.filter(inv => inv.status === 'Overdue').length;
  const completionRate = Math.round((invoices.filter(inv => inv.status === 'Paid').length / Math.max(invoices.length, 1)) * 100);

  // SummaryCard action: context-aware
  const handleSummaryAction = () => {
    if (activeTab === 'created') navigate('/invoice/new');
    else if (activeTab === 'received') navigate('/payments');
    else navigate('/invoice/new');
  };

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8 pb-32 relative min-h-screen">
      {/* Header now includes the tab dropdown */}
      <TransactionsHeader 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mb-6">
        <SummaryCard
          activeTab={activeTab}
          totalAmount={totalAmount}
          onAction={handleSummaryAction}
        />
      </div>

      <div className="mb-8">
        <MiniInsights
          pendingCount={pendingCount}
          overdueCount={overdueCount}
          completionRate={completionRate}
        />
      </div>

      <div className="mb-8">
        <FilterControls
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      <TransactionList 
        invoices={filteredInvoices} 
        activeTab={activeTab} 
        onSelectInvoice={setSelectedInvoice}
        onPay={(id) => navigate('/payments', { state: { invoiceId: id } })}
      />

      <FloatingActionButton onClick={() => navigate('/invoice/new')} />
    </main>
  );
}
