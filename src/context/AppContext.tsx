import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';
import { Invoice, INVOICES as MOCK_INVOICES, NOTIFICATIONS as MOCK_NOTIFICATIONS } from '../data/mockData';
import { interswitchService } from '../services/interswitchService';

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

  const [credTurnScore, setCredTurnScore] = useState(() => getInitialState('credTurnScore', 72));
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialState('isDarkMode', false));
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => getInitialState('notificationsEnabled', true));
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getInitialState('userProfile', {
    name: 'Chioma',
    email: 'chioma@example.com',
    phone: '+234 803 123 4567',
    profileImage: null,
  }));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState('notifications', 
    MOCK_NOTIFICATIONS.map(n => ({ ...n, type: n.title.includes('Invoice') ? 'invoice' : n.title.includes('score') ? 'score' : 'payment' })) as Notification[]
  ));
  const [invoices, setInvoices] = useState<Invoice[]>(() => getInitialState('invoices', MOCK_INVOICES));

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
      
      // Simulate buyer receiving it after 2 seconds
      setTimeout(() => {
        const receivedInvoice: Invoice = {
          ...invoice,
          id: 'r-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          type: 'received',
          buyer: 'Chioma',
          seller: invoice.buyer, 
          expiresAt: Date.now() + 300000 // 5 minutes
        };
        setIncomingInvoice(receivedInvoice);
        
        // Add notification for received
        const newNotification: Notification = {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          title: `New Invoice received from ${receivedInvoice.seller}`,
          time: 'Just now',
          read: false,
          type: 'invoice',
          dataId: receivedInvoice.id
        };
        setNotifications(prev => [newNotification, ...prev]);
      }, 2000);
    }

    // Add notification for sent
    const newNotification: Notification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      title: `Invoice ${invoice.reference} sent to ${invoice.buyer}`,
      time: 'Just now',
      read: false,
      type: 'invoice',
      dataId: invoice.id
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const updateInvoiceStatus = (id: string, status: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
      const newNotification: Notification = {
        id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        title: `Invoice ${invoice.reference} status updated to ${status}`,
        time: 'Just now',
        read: false,
        type: 'invoice',
        dataId: invoice.id
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const processPayment = (invoiceId: string, amount: number, method: string) => {
    const performUpdate = () => {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          const newBalance = Math.max(0, inv.outstandingBalance - amount);
          const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';
          
          const scoreChange = newBalance === 0 ? 5 : 2;
          setCredTurnScore(s => Math.min(100, s + scoreChange));
          
          const newNotification: Notification = {
            id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            title: `Payment of ₦${amount.toLocaleString()} successful via ${method}`,
            time: 'Just now',
            read: false,
            type: 'payment',
            dataId: inv.id
          };
          setNotifications(n => [newNotification, ...n]);
          
          return { ...inv, outstandingBalance: newBalance, status: newStatus };
        }
        return inv;
      }));
    };

    if (method === 'Interswitch') {
      interswitchService.pay(amount, userProfile.email, userProfile.name, performUpdate);
    } else {
      performUpdate();
    }
  };

  const processLoanPayment = (invoiceId: string, amount: number, partnerName: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const scoreChange = 1; 
        setCredTurnScore(s => Math.min(100, s + scoreChange));
        
        const newNotification: Notification = {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
          title: `Invoice ${inv.reference} paid via loan from ${partnerName}`,
          time: 'Just now',
          read: false,
          type: 'payment',
          dataId: inv.id
        };
        setNotifications(n => [newNotification, ...n]);
        
        return { ...inv, outstandingBalance: 0, status: 'Paid' };
      }
      return inv;
    }));
  };

  // Check for expired invoices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setInvoices(prev => {
        let changed = false;
        const next = prev.map(inv => {
          if (inv.status === 'Pending Acceptance' && inv.expiresAt && now > inv.expiresAt) {
            changed = true;
            return { ...inv, status: 'Expired' as const };
          }
          return inv;
        });
        
        if (changed && incomingInvoice && incomingInvoice.status === 'Pending Acceptance' && incomingInvoice.expiresAt && now > incomingInvoice.expiresAt) {
          setIncomingInvoice(prevInc => prevInc ? { ...prevInc, status: 'Expired' as const } : null);
        }
        
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [incomingInvoice]);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('credTurnScore', JSON.stringify(credTurnScore));
  }, [credTurnScore]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

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
