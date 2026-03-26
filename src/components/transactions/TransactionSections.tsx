import { motion } from 'motion/react';
import { RotateCcw, Info, Clock, AlertCircle, CheckCircle2, ChevronDown, Calendar, Plus } from 'lucide-react';

type TabType = 'all' | 'created' | 'received';
type FilterType = 'All' | 'Pending' | 'Overdue' | 'Completed';

export function TransactionsHeader({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold font-headline text-on-surface">Transactions</h1>
        <button 
          onClick={onClearFilters}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
      <p className="text-sm font-medium text-on-surface-variant/70">Manage your transactions with ease</p>
    </div>
  );
}

export function TransactionsTabs({ activeTab, onTabChange }: { activeTab: TabType, onTabChange: (tab: TabType) => void }) {
  return (
    <div className="bg-surface-container-low p-1.5 rounded-2xl flex mb-8 relative border border-outline-variant/10 shadow-sm">
      <button
        onClick={() => onTabChange('all')}
        className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
          activeTab === 'all' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        {activeTab === 'all' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white rounded-xl shadow-md"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-20">All</span>
      </button>
      <button
        onClick={() => onTabChange('created')}
        className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
          activeTab === 'created' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        {activeTab === 'created' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white rounded-xl shadow-md"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-20">Created</span>
      </button>
      <button
        onClick={() => onTabChange('received')}
        className={`relative flex-1 py-3 rounded-xl text-sm font-bold transition-all z-10 ${
          activeTab === 'received' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        {activeTab === 'received' && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white rounded-xl shadow-md"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-20">Received</span>
      </button>
    </div>
  );
}

export function SummaryCard({ activeTab, totalAmount }: { activeTab: TabType, totalAmount: number }) {
  const getLabel = () => {
    if (activeTab === 'all') return 'Total Volume';
    if (activeTab === 'created') return 'Total Issued';
    return 'Total Owed';
  };

  const getDescription = () => {
    if (activeTab === 'all') return 'Total value of all your transactions on CredTurn';
    if (activeTab === 'created') return 'Total value of credit you’ve issued to your partners';
    return 'Total value of credit you owe to your suppliers';
  };

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-10 mb-10 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-3">
          {getLabel()}
        </p>
        <h2 className="text-5xl font-extrabold font-headline text-white tracking-tighter mb-4">
          ₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
        </h2>
        <p className="text-sm font-medium text-white/80 flex items-center gap-2">
          <Info className="w-4 h-4" />
          {getDescription()}
        </p>
      </div>
    </div>
  );
}

export function MiniInsights({ pendingCount, overdueCount, completionRate }: { pendingCount: number, overdueCount: number, completionRate: number }) {
  return (
    <div className="flex flex-wrap gap-4 mb-10">
      <div className="flex-1 min-w-[200px] bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{pendingCount} Pending</p>
          <p className="text-[10px] text-on-surface-variant/60 font-medium">Payments this week</p>
        </div>
      </div>
      <div className="flex-1 min-w-[200px] bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{overdueCount} Overdue</p>
          <p className="text-[10px] text-on-surface-variant/60 font-medium">Take action now</p>
        </div>
      </div>
      <div className="flex-1 min-w-[200px] bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{completionRate}% Completed</p>
          <p className="text-[10px] text-on-surface-variant/60 font-medium">Transactions this month</p>
        </div>
      </div>
    </div>
  );
}

export function FilterControls({ activeFilter, onFilterChange }: { activeFilter: FilterType, onFilterChange: (filter: FilterType) => void }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 mb-10">
      <div className="flex-grow">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3 ml-2">Filter by Status</p>
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Overdue', 'Completed'].map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter as FilterType)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeFilter === filter
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                  : 'bg-white text-on-surface-variant border-outline-variant/30 hover:border-primary/30'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full md:w-72">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-3 ml-2">Showing: October 2026</p>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <select className="w-full bg-white border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm font-bold text-on-surface appearance-none focus:outline-none focus:border-primary shadow-sm">
              <option>October 2026</option>
              <option>September 2026</option>
              <option>August 2026</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
          <button className="w-12 h-12 bg-white border border-outline-variant/30 rounded-2xl flex items-center justify-center text-on-surface-variant hover:border-primary/30 transition-colors shadow-sm">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-24 right-6 group flex items-center gap-3">
      <motion.span 
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="bg-on-surface text-surface px-4 py-2 rounded-xl text-xs font-bold shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      >
        Create Invoice
      </motion.span>
      <button
        onClick={onClick}
        className="w-16 h-16 bg-primary text-on-primary rounded-2xl shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
