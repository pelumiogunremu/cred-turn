import { Invoice } from '../data/mockData';

export type InvoiceState = 'Not Due' | 'Almost Due' | 'Due' | 'Overdue';

export const invoiceService = {
  getInvoiceState: (invoice: Invoice): InvoiceState => {
    if (invoice.status === 'Paid' || invoice.status === 'Completed') return 'Not Due';
    
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    
    // Reset hours for accurate day comparison
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due';
    if (diffDays <= 3) return 'Almost Due';
    return 'Not Due';
  },

  isPaymentEnabled: (invoice: Invoice): boolean => {
    const allowedStatuses = ['Accepted', 'Unpaid', 'Overdue', 'Partially Paid'];
    return allowedStatuses.includes(invoice.status);
  }
};
