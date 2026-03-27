import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Info, Clock, AlertCircle, CheckCircle2, ChevronDown, Calendar, Plus, ArrowRight } from 'lucide-react';

type TabType = 'all' | 'created' | 'received';
type FilterType = 'All' | 'Pending' | 'Overdue' | 'Paid';

// TransactionsHeader: removed "Clear Filters" text; Tab dropdown moved here
export function TransactionsHeader({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) {
  const TAB_LABELS: Record<TabType, string> = {
    all: 'All Transactions',
    created: 'Created',
    received: 'Received',
  };

  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-headline text-on-surface">Transactions</h1>
          <p className="text-sm font-medium text-on-surface-variant/70 mt-1">Manage your transactions with ease</p>
        </div>
        {/* Tab dropdown — replaces the old tab switcher row below the header */}
        <div className="relative shrink-0">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value as TabType)}
            className="appearance-none bg-surface-container-lowest border border-outline-variant/30 rounded-2xl pl-4 pr-9 py-3 text-sm font-bold text-on-surface focus:outline-none focus:border-primary shadow-sm cursor-pointer"
          >
            <option value="all">All Transactions</option>
            <option value="created">Created</option>
            <option value="received">Received</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

// SummaryCard — with action button below the total
export function SummaryCard({
  activeTab,
  totalAmount,
  onAction,
}: {
  activeTab: TabType;
  totalAmount: number;
  onAction?: () => void;
}) {
  const getLabel = () => {
    if (activeTab === 'all') return 'TOTAL VOLUME';
    if (activeTab === 'created') return 'TOTAL ISSUED';
    return 'TOTAL RECEIVED';
  };

  const getDescription = () => {
    if (activeTab === 'all') return 'Total value of all your transactions on CredTurn';
    if (activeTab === 'created') return "Total value of credit you've issued to your customers";
    return 'Total value of credit you owe to your suppliers';
  };

  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-primary via-primary/90 to-emerald-500 rounded-2xl p-8 mb-6 relative overflow-hidden shadow-2xl shadow-primary/20">
      <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -left-12 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
            {getLabel()}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-headline text-white tracking-tighter mb-2 truncate">
            ₦{totalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-sm font-medium text-white/70 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 shrink-0" />
            {getDescription()}
          </p>
        </div>
        {/* Extreme right actionable button */}
        <button
          onClick={() => navigate('/invoice/new')}
          className="ml-auto shrink-0 flex items-center gap-2 bg-white text-primary font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg border border-transparent hover:bg-white/90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>
    </div>
  );
}

export function MiniInsights({ pendingCount, overdueCount, completionRate }: { pendingCount: number, overdueCount: number, completionRate: number }) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <div className="flex-1 min-w-[160px] bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/15 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface uppercase">{pendingCount} PENDING</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Payments this week</p>
        </div>
      </div>
      <div className="flex-1 min-w-[160px] bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/15 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface uppercase">{overdueCount} OVERDUE</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Take action now</p>
        </div>
      </div>
      <div className="flex-1 min-w-[160px] bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/15 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface uppercase">{completionRate}% COMPLETED</p>
          <p className="text-[10px] text-on-surface-variant font-medium">Transactions this month</p>
        </div>
      </div>
    </div>
  );
}

// FilterControls — removed old tab row, kept status chips + modern period dropdown
export function FilterControls({ activeFilter, onFilterChange }: { activeFilter: FilterType, onFilterChange: (filter: FilterType) => void }) {
  const calendarRef = useRef<HTMLInputElement>(null);
  const now = new Date();
  const currentMonth = now.toLocaleString('en-NG', { month: 'long', year: 'numeric' });
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString('en-NG', { month: 'long', year: 'numeric' });
  const prev2Month = new Date(now.getFullYear(), now.getMonth() - 2, 1).toLocaleString('en-NG', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-start">
      <div className="flex-grow">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2.5 ml-1">FILTER BY STATUS</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 sm:pb-0 hide-scrollbar smooth-scroll w-[100vw] sm:w-auto">
          {(['All', 'Pending', 'Overdue', 'Paid'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                activeFilter === filter
                  ? 'bg-primary text-on-primary border-primary shadow-md shadow-primary/20'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-primary/30 hover:text-primary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      
      {/* Modern period dropdown with styled display + calendar button */}
      <div className="w-full md:w-64 shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2.5 ml-1">SHOWING: OCTOBER 2026</p>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <select className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm font-semibold text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer">
              <option>October 2026</option>
              <option>September 2026</option>
              <option>August 2026</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
          </div>
          {/* Interactive calendar button */}
          <div className="relative">
            <input
              ref={calendarRef}
              type="date"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={() => {}}
            />
            <button
              type="button"
              onClick={() => calendarRef.current?.showPicker?.()}
              className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
              title="Pick custom date"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>
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
