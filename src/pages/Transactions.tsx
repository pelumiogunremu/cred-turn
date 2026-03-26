import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import TransactionList from '../components/TransactionList';
import { 
  TransactionsHeader, 
  TransactionsTabs, 
  SummaryCard, 
  MiniInsights, 
  FilterControls, 
  FloatingActionButton 
} from '../components/transactions/TransactionSections';

type TabType = 'all' | 'created' | 'received';
type FilterType = 'All' | 'Pending' | 'Overdue' | 'Completed';

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
      (activeFilter === 'Pending' && ['Unpaid', 'Partially Paid', 'Pending Acceptance', 'Accepted'].includes(inv.status)) ||
      (activeFilter === 'Overdue' && inv.status === 'Overdue') ||
      (activeFilter === 'Completed' && ['Paid', 'Completed'].includes(inv.status));
      
    return matchesTab && matchesFilter;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => {
    // For 'all' tab, we might want to show total volume or net. 
    // Let's show total volume for now as requested.
    return sum + inv.amount;
  }, 0);

  // Mini Insights Logic
  const pendingCount = filteredInvoices.filter(inv => ['Unpaid', 'Partially Paid', 'Pending Acceptance', 'Accepted'].includes(inv.status)).length;
  const overdueCount = filteredInvoices.filter(inv => inv.status === 'Overdue').length;
  const completionRate = Math.round((invoices.filter(inv => inv.status === 'Paid' || inv.status === 'Completed').length / invoices.length) * 100) || 0;

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8 pb-32 relative min-h-screen">
      <TransactionsHeader 
        onClearFilters={() => {
          setActiveFilter('All');
          setActiveTab('all');
        }} 
      />

      <TransactionsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <SummaryCard activeTab={activeTab} totalAmount={totalAmount} />

      <MiniInsights 
        pendingCount={pendingCount} 
        overdueCount={overdueCount} 
        completionRate={completionRate} 
      />

      <FilterControls 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

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
