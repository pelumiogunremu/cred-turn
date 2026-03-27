import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { Invoice, Loan, INVOICES as MOCK_INVOICES, MOCK_LOANS, NOTIFICATIONS as MOCK_NOTIFICATIONS } from '../data/mockData';
import { scoreService } from '../services/scoreService';
import { notificationService } from '../services/notificationService';
// interswitchService is used directly in interswitchService.ts — do not import here

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type?: 'invoice' | 'payment' | 'score';
  dataId?: string;
}

interface AppContextType {
  credTurnScore: number;
  setCredTurnScore: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  notificationsEnabled: boolean;
  setNotificationsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  loans: Loan[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  
  // Global Modals State
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  selectedPayment: any | null;
  setSelectedPayment: (payment: any | null) => void;
  selectedUser: any | null;
  setSelectedUser: (user: any | null) => void;
  isScoreModalOpen: boolean;
  setIsScoreModalOpen: (isOpen: boolean) => void;

  // New Lifecycle Modals
  invoiceSentData: Invoice | null;
  setInvoiceSentData: (invoice: Invoice | null) => void;
  incomingInvoice: Invoice | null;
  setIncomingInvoice: (invoice: Invoice | null) => void;

  // Methods
  addInvoice: (invoice: Invoice) => void;
  updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  processPayment: (invoiceId: string, amount: number, method: string) => void;
  processLoanPayment: (invoiceId: string, amount: number, partnerName: string) => void;
  repayLoan: (loanId: string, amount: number) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence Helpers
  const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const [credTurnScore, setCredTurnScore] = useState(() => getInitialState('credturn_score', 72));
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialState('credturn_isDarkMode', false));
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => getInitialState('credturn_notificationsEnabled', true));
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getInitialState('credturn_userProfile', {
    name: 'Chioma',
    email: 'chioma@example.com',
    phone: '+234 803 123 4567',
    profileImage: null,
  }));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState('credturn_notifications', 
    MOCK_NOTIFICATIONS.map(n => ({ ...n, type: n.title.includes('Invoice') ? 'invoice' : n.title.includes('score') ? 'score' : 'payment' })) as Notification[]
  ));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInitialState('credturn_invoices', MOCK_INVOICES));
  const [loans, setLoans] = useState<Loan[]>(() => getInitialState('credturn_loans', MOCK_LOANS));

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const [invoiceSentData, setInvoiceSentData] = useState<Invoice | null>(null);
  const [incomingInvoice, setIncomingInvoice] = useState<Invoice | null>(null);
  
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Invoice Lifecycle Methods
  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    
    if (invoice.type === 'sent') {
      setInvoiceSentData(invoice);
    }

    // Add notification for sent
    const sentNotif = notificationService.createNotification(
      `Invoice ${invoice.reference} sent to ${invoice.buyer}`,
      'invoice',
      invoice.id
    );
    setNotifications(prev => [sentNotif, ...prev]);
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        // FIX M5: Zero balance for terminal statuses so Dashboard doesn't show ghost debt
        const newBalance = ['Rejected', 'Expired'].includes(status) ? 0 : inv.outstandingBalance;
        if (status === 'Overdue') {
          const scoreChange = scoreService.calculateScoreChange('overdue_incident');
          setCredTurnScore(s => Math.max(0, s + scoreChange));
        }
        return { ...inv, status, outstandingBalance: newBalance };
      }
      return inv;
    }));
    
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      const notif = notificationService.createNotification(
        `Invoice ${invoice.reference} status updated to ${status}`,
        'invoice',
        invoice.id
      );
      setNotifications(prev => [notif, ...prev]);
    }
  };

  const processPayment = (invoiceId: string, amount: number, method: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newBalance = Math.max(0, inv.outstandingBalance - amount);
        const isPaid = newBalance === 0;
        const newStatus = isPaid ? 'Paid' : 'Partially Paid';
        
        // FIX C4: Use scoreService instead of magic numbers
        const scoreAction = isPaid ? 
          (inv.status === 'Overdue' ? 'overdue_payment' : 'full_payment') : 
          'partial_payment';
        const scoreChange = scoreService.calculateScoreChange(scoreAction);
        setCredTurnScore(s => Math.min(100, s + scoreChange));
        
        // FIX M2: Use notificationService factory
        const notif = notificationService.createNotification(
          `Payment of ₦${amount.toLocaleString()} successful via ${method}`,
          'payment',
          inv.id
        );
        setNotifications(n => [notif, ...n]);
        
        return { ...inv, outstandingBalance: newBalance, status: newStatus };
      }
      return inv;
    }));
    // FIX M4: Removed Interswitch re-invocation — payment is already done before this is called
  };

  const processLoanPayment = (invoiceId: string, amount: number, partnerName: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        // FIX C4: Use scoreService
        const scoreChange = scoreService.calculateScoreChange('loan_payment');
        setCredTurnScore(s => Math.min(100, s + scoreChange));
        
        const notif = notificationService.createNotification(
          `Invoice ${inv.reference} paid via loan from ${partnerName}`,
          'payment',
          inv.id
        );
        setNotifications(n => [notif, ...n]);
        
        // Also magically issue the loan tracking
        const newLoan: Loan = {
          id: `loan-${Date.now()}`,
          partnerName: partnerName,
          amount: inv.outstandingBalance,
          outstandingBalance: inv.outstandingBalance, // With added interest it might be higher, mock simply
          dateTaken: new Date().toLocaleDateString('en-NG', { month: 'short', day: '2-digit', year: 'numeric' }),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', { month: 'short', day: '2-digit', year: 'numeric' }),
          status: 'Active'
        };
        setLoans(l => [newLoan, ...l]);

        return { ...inv, outstandingBalance: 0, status: 'Paid' };
      }
      return inv;
    }));
  };

  const repayLoan = (loanId: string, amount: number) => {
    setLoans(prev => prev.map(loan => {
      if (loan.id === loanId) {
        const newBalance = Math.max(0, loan.outstandingBalance - amount);
        const isPaid = newBalance === 0;
        
        const scoreChange = scoreService.calculateScoreChange('full_payment');
        setCredTurnScore(s => Math.min(100, s + scoreChange));

        const notif = notificationService.createNotification(
          `Successfully repaid ₦${amount.toLocaleString()} to ${loan.partnerName}`,
          'payment',
          loan.id
        );
        setNotifications(n => [notif, ...n]);

        return { ...loan, outstandingBalance: newBalance, status: isPaid ? 'Paid' : 'Active' };
      }
      return loan;
    }));
  };

  // Check for expired invoices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setInvoices(prev => {
        const next = prev.map(inv => {
          if (inv.status === 'Pending' && inv.expiresAt && now > inv.expiresAt) {
            // FIX M1: Add notification on expiry
            const notif = notificationService.createNotification(
              `Invoice ${inv.reference} has expired`,
              'invoice',
              inv.id
            );
            setNotifications(n => [notif, ...n]);
            // FIX M5: Zero the balance to prevent ghost debt on Dashboard
            return { ...inv, status: 'Expired' as const, outstandingBalance: 0 };
          }
          return inv;
        });
        return next;
      });
      
      if (incomingInvoice && incomingInvoice.status === 'Pending' && incomingInvoice.expiresAt && now > incomingInvoice.expiresAt) {
        setIncomingInvoice(prevInc => prevInc ? { ...prevInc, status: 'Expired' as const } : null);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [incomingInvoice]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('credturn_score', JSON.stringify(credTurnScore));
  }, [credTurnScore]);

  useEffect(() => {
    localStorage.setItem('credturn_isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('credturn_notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('credturn_userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('credturn_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('credturn_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('credturn_loans', JSON.stringify(loans));
  }, [loans]);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        credTurnScore,
        setCredTurnScore,
        isDarkMode,
        setIsDarkMode,
        notificationsEnabled,
        setNotificationsEnabled,
        userProfile,
        setUserProfile,
        notifications,
        setNotifications,
        invoices,
        setInvoices,
        loans,
        setLoans,
        selectedInvoice,
        setSelectedInvoice,
        selectedPayment,
        setSelectedPayment,
        selectedUser,
        setSelectedUser,
        isScoreModalOpen,
        setIsScoreModalOpen,
        invoiceSentData,
        setInvoiceSentData,
        incomingInvoice,
        setIncomingInvoice,
        addInvoice,
        updateInvoiceStatus,
        processPayment,
        processLoanPayment,
        repayLoan,
        showToast
      }}
    >
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border ${
                toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
                'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 shrink-0" />}
              <span className="text-sm font-bold font-label whitespace-pre-wrap flex-1">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Internal-only alias to satisfy Fast Refresh
export const useAppContext = useApp;
