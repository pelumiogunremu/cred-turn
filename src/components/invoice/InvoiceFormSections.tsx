import { ArrowLeft, User, Calendar, DollarSign, FileText, Send, Plus, Trash2 } from 'lucide-react';

type LineItem = { id: number; description: string; amount: string };

export function InvoiceHeader({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <button type="button" onClick={onBack} className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">Create Invoice</h1>
        <p className="text-sm text-on-surface-variant font-medium">Request payment or settlement</p>
      </div>
    </div>
  );
}

export function ClientDetailsSection({ 
  clientName, setClientName, clientEmail, setClientEmail 
}: { 
  clientName: string, setClientName: (v: string) => void, 
  clientEmail: string, setClientEmail: (v: string) => void 
}) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
      <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Client Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 ml-1" htmlFor="clientName">Client Name / Company</label>
          <input 
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-on-surface placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none" 
            id="clientName" 
            placeholder="e.g. Tunde Enterprise" 
            required 
            type="text" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 ml-1" htmlFor="clientEmail">Client Email</label>
          <input 
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-on-surface placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none" 
            id="clientEmail" 
            placeholder="billing@tunde.com" 
            required 
            type="email" 
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

export function InvoiceDetailsSection({
  invoiceDate, setInvoiceDate, dueDate, setDueDate
}: {
  invoiceDate: string, setInvoiceDate: (v: string) => void,
  dueDate: string, setDueDate: (v: string) => void
}) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
      <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary" />
        Invoice Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 ml-1" htmlFor="invoiceDate">Invoice Date</label>
          <input 
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none" 
            id="invoiceDate" 
            required 
            type="date" 
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/70 ml-1" htmlFor="dueDate">Due Date</label>
          <input 
            className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none" 
            id="dueDate" 
            required 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

export function LineItemsSection({ items, onAddItem, onRemoveItem, onItemChange, totalAmount }: { 
  items: LineItem[], 
  onAddItem: () => void, 
  onRemoveItem: (id: number) => void, 
  onItemChange: (index: number, field: 'description' | 'amount', value: string) => void,
  totalAmount: string 
}) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-lg font-bold text-on-surface flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Line Items
        </h2>
        <button type="button" onClick={onAddItem} className="text-sm font-bold text-primary hover:text-emerald-600 flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex items-start gap-4 p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/10">
            <div className="flex-grow space-y-4">
              <div className="space-y-2">
                <label className="block font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 ml-1">Description</label>
                <input
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2.5 px-3 text-sm text-on-surface placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="Service or product description"
                  required
                  type="text"
                  value={item.description}
                  onChange={(e) => onItemChange(index, 'description', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 ml-1">Amount (₦)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-zinc-400 font-bold">₦</span>
                  </div>
                  <input
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2.5 pl-9 pr-3 text-sm text-on-surface placeholder:text-zinc-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="0.00"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(e) => onItemChange(index, 'amount', e.target.value)}
                  />
                </div>
              </div>
            </div>
            {items.length > 1 && (
              <button type="button" onClick={() => onRemoveItem(item.id)} className="mt-6 p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-outline-variant/15 flex justify-end">
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-sm text-on-surface-variant font-medium">
            <span>Subtotal</span>
            <span>₦{totalAmount}</span>
          </div>
          <div className="flex justify-between text-sm text-on-surface-variant font-medium">
            <span>Tax (0%)</span>
            <span>₦0.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-on-surface pt-3 border-t border-outline-variant/15">
            <span>Total</span>
            <span className="text-primary">₦{totalAmount}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InvoiceActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="flex gap-4 pt-4">
      <button type="button" onClick={onCancel} className="flex-1 py-4 rounded-xl font-bold text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-colors">
        Cancel
      </button>
      <button type="submit" className="flex-[2] bg-primary text-white font-headline font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-emerald-600 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2">
        Send Invoice
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
