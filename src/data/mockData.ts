export interface Invoice {
  id: string;
  name: string;
  reference: string;
  amount: number;
  outstandingBalance: number;
  status: 'Pending Acceptance' | 'Accepted' | 'Rejected' | 'Expired' | 'Partially Paid' | 'Unpaid' | 'Overdue' | 'Paid' | 'Completed';
  date: string;
  dueDate: string;
  description?: string;
  category: string;
  buyer: string;
  seller: string;
  type: 'sent' | 'received';
  isManualEntry?: boolean;
  contributesToScore?: boolean;
  expiresAt?: number; // Timestamp for countdown
}

export const INVOICES: Invoice[] = [
  {
    id: 'c1',
    name: 'Tunde Provision Store',
    reference: 'INV-2026-001',
    amount: 24500.00,
    outstandingBalance: 24500.00,
    status: 'Pending Acceptance',
    date: 'Mar 20, 2026',
    dueDate: 'Apr 20, 2026',
    category: 'Retail Supplies',
    buyer: 'Tunde Provision Store',
    seller: 'Chioma',
    type: 'sent'
  },
  {
    id: 'c2',
    name: 'Musa POS Agent',
    reference: 'INV-2026-002',
    amount: 120000.00,
    outstandingBalance: 0,
    status: 'Paid',
    date: 'Mar 15, 2026',
    dueDate: 'Mar 25, 2026',
    category: 'Cash Liquidity',
    buyer: 'Musa POS Agent',
    seller: 'Chioma',
    type: 'sent'
  },
  {
    id: 'c3',
    name: 'Aisha Food Vendor',
    reference: 'INV-2026-003',
    amount: 8500.00,
    outstandingBalance: 0,
    status: 'Paid',
    date: 'Mar 10, 2026',
    dueDate: 'Mar 20, 2026',
    category: 'Catering Services',
    buyer: 'Aisha Food Vendor',
    seller: 'Chioma',
    type: 'sent'
  },
  {
    id: 'c4',
    name: 'Emeka Electronics',
    reference: 'INV-2026-004',
    amount: 12000.00,
    outstandingBalance: 12000.00,
    status: 'Overdue',
    date: 'Feb 28, 2026',
    dueDate: 'Mar 15, 2026',
    category: 'Gadget Repair',
    buyer: 'Emeka Electronics',
    seller: 'Chioma',
    type: 'sent'
  },
  {
    id: 'r1',
    name: 'Lagos Logistics',
    reference: 'INV-2026-R01',
    amount: 4500.00,
    outstandingBalance: 4500.00,
    status: 'Unpaid',
    date: 'Mar 22, 2026',
    dueDate: 'Apr 05, 2026',
    category: 'Delivery Services',
    buyer: 'Chioma',
    seller: 'Lagos Logistics',
    type: 'received'
  },
  {
    id: 'r2',
    name: 'Abuja Power Distro',
    reference: 'INV-2026-R02',
    amount: 12900.00,
    outstandingBalance: 12900.00,
    status: 'Overdue',
    date: 'Mar 05, 2026',
    dueDate: 'Mar 20, 2026',
    category: 'Utilities',
    buyer: 'Chioma',
    seller: 'Abuja Power Distro',
    type: 'received'
  },
  {
    id: 'r3',
    name: 'Kano Grains Market',
    reference: 'INV-2026-R03',
    amount: 15000.00,
    outstandingBalance: 15000.00,
    status: 'Pending Acceptance',
    date: 'Mar 25, 2026',
    dueDate: 'Apr 25, 2026',
    category: 'Wholesale Grains',
    buyer: 'Chioma',
    seller: 'Kano Grains Market',
    type: 'received',
    expiresAt: Date.now() + 300000 // 5 minutes from now
  }
];

export const NOTIFICATIONS = [
  { id: '1', title: 'Payment of ₦85,000 received from Tunde', time: 'Just now', read: false },
  { id: '2', title: 'Invoice INV-2026-003 is due tomorrow', time: '2 hours ago', read: false },
  { id: '3', title: 'Your CredTurn score increased by 2 points', time: '1 day ago', read: true },
];

export const getSearchResults = (query: string) => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  
  const invoiceResults = INVOICES.filter(inv => 
    inv.name.toLowerCase().includes(lowerQuery) || 
    inv.reference.toLowerCase().includes(lowerQuery)
  ).map(inv => ({
    id: inv.id,
    title: `${inv.type === 'sent' ? 'Sent' : 'Received'} Invoice: ${inv.name}`,
    type: 'Invoice',
    path: '/activity',
    state: { tab: inv.type === 'sent' ? 'created' : 'received' }
  }));

  return [
    ...invoiceResults,
    { id: `payment-${query}`, title: `Payment to ${query}`, type: 'Payment', path: '/payments' },
    { id: `contact-${query}`, title: `Contact: ${query}`, type: 'Contact', path: '/profile' },
  ];
};
