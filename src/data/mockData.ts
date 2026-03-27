export interface Invoice {
  id: string;
  name: string;
  reference: string;
  amount: number;
  outstandingBalance: number;
  status: 'Not Due' | 'Due' | 'Overdue' | 'Paid' | 'Partially Paid' | 'Pending' | 'Rejected' | 'Expired';
  date: string;
  dueDate: string;
  description?: string;
  category: string;
  buyer: string;
  seller: string;
  type: 'sent' | 'received';
  isManualEntry?: boolean;
  contributesToScore?: boolean;
  expiresAt?: number;
  creatorEmail?: string;
}

export interface Loan {
  id: string;
  partnerName: string;
  amount: number;
  outstandingBalance: number;
  dateTaken: string;
  dueDate: string;
  status: 'Active' | 'Paid';
}

export const INVOICES: Invoice[] = [
  // --- SENT INVOICES (Credit issued to customers) ---
  {
    id: 's1', name: 'Alapere Auto Shop', reference: 'INV-2026-S01', amount: 150000, outstandingBalance: 150000, 
    status: 'Pending', date: 'Mar 25, 2026', dueDate: 'Apr 25, 2026', category: 'Auto Parts', 
    buyer: 'Alapere Auto Shop', seller: 'Chioma', type: 'sent', expiresAt: Date.now() + 86400000
  },
  {
    id: 's2', name: 'Lagos Bakery Hub', reference: 'INV-2026-S02', amount: 85000, outstandingBalance: 85000, 
    status: 'Overdue', date: 'Jan 10, 2026', dueDate: 'Jan 24, 2026', category: 'Catering', 
    buyer: 'Lagos Bakery Hub', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's3', name: 'Delta Logistics Co.', reference: 'INV-2026-S03', amount: 300000, outstandingBalance: 100000, 
    status: 'Partially Paid', date: 'Mar 01, 2026', dueDate: 'Mar 15, 2026', category: 'Transport', 
    buyer: 'Delta Logistics Co.', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's4', name: 'Nkechi Supermarket', reference: 'INV-2026-S04', amount: 200000, outstandingBalance: 0, 
    status: 'Paid', date: 'Feb 05, 2026', dueDate: 'Feb 12, 2026', category: 'Retail', 
    buyer: 'Nkechi Supermarket', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's5', name: 'Adeola Tech Store', reference: 'INV-2026-S05', amount: 450000, outstandingBalance: 450000, 
    status: 'Due', date: 'Mar 20, 2026', dueDate: 'Mar 28, 2026', category: 'Electronics', 
    buyer: 'Adeola Tech Store', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's6', name: 'Yaba Builders Ltd.', reference: 'INV-2026-S06', amount: 750000, outstandingBalance: 750000, 
    status: 'Not Due', date: 'Mar 26, 2026', dueDate: 'Apr 30, 2026', category: 'Construction', 
    buyer: 'Yaba Builders Ltd.', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's7', name: 'Owerri Paints', reference: 'INV-2026-S07', amount: 120000, outstandingBalance: 0, 
    status: 'Rejected', date: 'Mar 22, 2026', dueDate: 'Apr 22, 2026', category: 'Supplies', 
    buyer: 'Owerri Paints', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's8', name: 'Kano Textiles', reference: 'INV-2026-S08', amount: 55000, outstandingBalance: 0, 
    status: 'Expired', date: 'Feb 20, 2026', dueDate: 'Mar 05, 2026', category: 'Fashion', 
    buyer: 'Kano Textiles', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's9', name: 'Ibadan Printers', reference: 'INV-2026-S09', amount: 180000, outstandingBalance: 180000, 
    status: 'Due', date: 'Mar 15, 2026', dueDate: 'Mar 27, 2026', category: 'Services', 
    buyer: 'Ibadan Printers', seller: 'Chioma', type: 'sent'
  },
  {
    id: 's10', name: 'Festac Pharmacies', reference: 'INV-2026-S10', amount: 320000, outstandingBalance: 120000, 
    status: 'Partially Paid', date: 'Mar 10, 2026', dueDate: 'Mar 20, 2026', category: 'Medical', 
    buyer: 'Festac Pharmacies', seller: 'Chioma', type: 'sent'
  },

  // --- RECEIVED INVOICES (Credit received from partners/sellers) ---
  {
    id: 'r1', name: 'Iya Basira Caterers', reference: 'INV-2026-R01', amount: 155000, outstandingBalance: 155000, 
    status: 'Overdue', date: 'Feb 15, 2026', dueDate: 'Mar 01, 2026', category: 'Food & Beverage', 
    buyer: 'Chioma', seller: 'Iya Basira Caterers', type: 'received'
  },
  {
    id: 'r2', name: 'Computer Village Ltd.', reference: 'INV-2026-R02', amount: 520000, outstandingBalance: 520000, 
    status: 'Due', date: 'Mar 15, 2026', dueDate: 'Mar 27, 2026', category: 'Equipment', 
    buyer: 'Chioma', seller: 'Computer Village Ltd.', type: 'received'
  },
  {
    id: 'r3', name: 'Emeka Spare Parts HQ', reference: 'INV-2026-R03', amount: 250000, outstandingBalance: 0, 
    status: 'Paid', date: 'Feb 01, 2026', dueDate: 'Feb 15, 2026', category: 'Maintenance', 
    buyer: 'Chioma', seller: 'Emeka Spare Parts HQ', type: 'received'
  },
  {
    id: 'r4', name: 'Ola Tailoring Services', reference: 'INV-2026-R04', amount: 60000, outstandingBalance: 60000, 
    status: 'Not Due', date: 'Mar 26, 2026', dueDate: 'Apr 25, 2026', category: 'Uniforms', 
    buyer: 'Chioma', seller: 'Ola Tailoring Services', type: 'received'
  },
  {
    id: 'r5', name: 'Abuja Freight Lines', reference: 'INV-2026-R05', amount: 850000, outstandingBalance: 400000, 
    status: 'Partially Paid', date: 'Mar 02, 2026', dueDate: 'Mar 18, 2026', category: 'Transport', 
    buyer: 'Chioma', seller: 'Abuja Freight Lines', type: 'received'
  },
  {
    id: 'r6', name: 'Jide Furniture Works', reference: 'INV-2026-R06', amount: 320000, outstandingBalance: 320000, 
    status: 'Pending', date: 'Mar 25, 2026', dueDate: 'Apr 25, 2026', category: 'Office Supplies', 
    buyer: 'Chioma', seller: 'Jide Furniture Works', type: 'received', expiresAt: Date.now() + 86400000
  },
  {
    id: 'r7', name: 'Lekki Cleaning Pro', reference: 'INV-2026-R07', amount: 45000, outstandingBalance: 0, 
    status: 'Rejected', date: 'Mar 22, 2026', dueDate: 'Apr 22, 2026', category: 'Services', 
    buyer: 'Chioma', seller: 'Lekki Cleaning Pro', type: 'received'
  },
  {
    id: 'r8', name: 'Arewa Distributors', reference: 'INV-2026-R08', amount: 150000, outstandingBalance: 150000, 
    status: 'Due', date: 'Mar 10, 2026', dueDate: 'Mar 28, 2026', category: 'Inventory', 
    buyer: 'Chioma', seller: 'Arewa Distributors', type: 'received'
  },
  {
    id: 'r9', name: 'Surulere Security', reference: 'INV-2026-R09', amount: 120000, outstandingBalance: 120000, 
    status: 'Not Due', date: 'Mar 20, 2026', dueDate: 'Apr 10, 2026', category: 'Services', 
    buyer: 'Chioma', seller: 'Surulere Security', type: 'received'
  },
  {
    id: 'r10', name: 'Trade Fair Giants', reference: 'INV-2026-R10', amount: 900500, outstandingBalance: 0, 
    status: 'Expired', date: 'Feb 10, 2026', dueDate: 'Mar 01, 2026', category: 'Bulk Goods', 
    buyer: 'Chioma', seller: 'Trade Fair Giants', type: 'received'
  }
];

export const MOCK_LOANS: Loan[] = [
  {
    id: 'loan1',
    partnerName: 'FairMoney Business',
    amount: 150000,
    outstandingBalance: 150000,
    dateTaken: 'Mar 01, 2026',
    dueDate: 'Apr 01, 2026',
    status: 'Active'
  },
  {
    id: 'loan2',
    partnerName: 'Carbon SME Loans',
    amount: 500000,
    outstandingBalance: 320000,
    dateTaken: 'Feb 15, 2026',
    dueDate: 'Apr 15, 2026',
    status: 'Active'
  },
  {
    id: 'loan3',
    partnerName: 'Renmoney Credit',
    amount: 75000,
    outstandingBalance: 75000,
    dateTaken: 'Mar 20, 2026',
    dueDate: 'Apr 20, 2026',
    status: 'Active'
  }
];

export const NOTIFICATIONS = [
  { id: '1', title: 'Payment of ₦250,000.00 received from Emeka Spare Parts HQ', time: 'Just now', read: false },
  { id: '2', title: 'Invoice INV-2026-R01 is overdue! Take action.', time: '2 hours ago', read: false },
  { id: '3', title: 'Your CredTurn score increased by 4 points', time: '1 day ago', read: true },
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
