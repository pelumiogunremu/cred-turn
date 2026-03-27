import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ReceiptText, User, Handshake, Bell, Search, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import InvoiceModal from './modals/InvoiceModal';
import PaymentModal from './modals/PaymentModal';
import UserModal from './modals/UserModal';
import ScoreModal from './modals/ScoreModal';
import InvoiceSentModal from './modals/InvoiceSentModal';
import IncomingInvoiceModal from './modals/IncomingInvoiceModal';


const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/transactions', icon: ReceiptText, label: 'Transactions' },
  { path: '/payments', icon: CreditCard, label: 'Payments' }
];


export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    notifications, 
    setNotifications,
    setSelectedInvoice, 
    selectedInvoice,
    selectedPayment,
    setSelectedPayment,
    selectedUser,
    setSelectedUser,
    isScoreModalOpen,
    setIsScoreModalOpen,
    credTurnScore,
    isDarkMode,
    setIsDarkMode,
    invoices
  } = useAppContext();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Don't show nav on auth pages, splash, success, or specific flows
  const hideNav = ['/', '/login', '/signup', '/recover', '/payment/success', '/invoice/new'].includes(location.pathname);

  if (hideNav) {
    return <Outlet />;
  }

  const lowerQuery = searchQuery.toLowerCase();
  const invoiceResults = searchQuery ? invoices.filter(inv => 
    inv.name.toLowerCase().includes(lowerQuery) || 
    inv.reference.toLowerCase().includes(lowerQuery)
  ).map(inv => ({
    id: inv.id,
    title: `${inv.type === 'sent' ? 'Sent' : 'Received'} Invoice: ${inv.name}`,
    type: 'Invoice',
    path: '/transactions',
    state: { tab: inv.type === 'sent' ? 'created' : 'received' }
  })) : [];

  const searchResults = searchQuery ? [
    ...invoiceResults,
    { id: `search-payment-${searchQuery}`, title: `Payment to ${searchQuery}`, type: 'Payment', path: '/payments' },
    { id: `search-contact-${searchQuery}`, title: `Contact: ${searchQuery}`, type: 'Contact', path: '/profile' },
  ] : [];

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const handleResultClick = (result: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    if (result.type === 'Invoice') {
      const invoice = invoices.find(inv => inv.id === result.id);
      if (invoice) setSelectedInvoice(invoice);
    } else if (result.type === 'Payment') {
      setSelectedPayment({ id: result.id, title: result.title });
    } else if (result.type === 'Contact') {
      setSelectedUser({ id: result.id, name: result.title.replace('Contact: ', '') });
    } else {
      navigate(result.path);
    }
  };

  const handleNotificationClick = (notification: any) => {
    setIsNotificationOpen(false);
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n));
    
    if (notification.type === 'invoice') {
      const invoiceId = notification.dataId;
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (invoice) setSelectedInvoice(invoice);
    } else if (notification.type === 'score') {
      setIsScoreModalOpen(true);
    } else {
      setSelectedPayment({ id: notification.id, title: notification.title });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Partially Paid': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };


  return (
    <div className="min-h-screen bg-background text-on-background font-body pb-24 md:pb-0 flex flex-col">
      {/* Top Nav for Desktop */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-outline-variant/10 sticky top-0 z-50">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center shadow-sm">
              <Handshake className="text-on-primary w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300 tracking-tighter hidden sm:block">CredTurn</span>
          </div>
         
          {/* Segmented Control Navigation (Desktop) */}
          <div className="hidden md:flex items-center bg-surface-container-low p-1 rounded-full border border-outline-variant/20">
            {NAV_ITEMS.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`relative px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                    isActive ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 bg-primary rounded-full shadow-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>


          <div className="flex items-center gap-2 sm:gap-4 relative" ref={searchRef}>
            {/* Search */}
            <div className="flex items-center justify-end relative">
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="overflow-hidden mr-2"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-surface-container-low hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
             
              {/* Search Dropdown */}
              <AnimatePresence>
                {isSearchOpen && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50"
                  >
                    {searchResults.length > 0 ? (
                      <>
                          {searchResults.map(result => (
                            <div
                              key={result.id}
                              onClick={() => handleResultClick(result)}
                              className="px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/10 last:border-0"
                            >
                              <p className="text-sm font-bold text-on-surface">{result.title}</p>
                              <p className="text-xs text-on-surface-variant">{result.type}</p>
                            </div>
                          ))}
                        <div className="p-2 bg-surface-container-lowest border-t border-outline-variant/10">
                          <button
                            onClick={() => {
                              setIsSearchOpen(false);
                              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                            }}
                            className="w-full py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          >
                            View All Results
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-on-surface-variant">
                        No results found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Notification */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-surface-container-low hover:text-primary transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
             
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-lowest">
                      <h3 className="font-bold text-on-surface">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                          {unreadNotificationsCount} New
                        </span>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.slice(0, 5).map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/10 transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                        >
                          <p className={`text-sm text-on-surface mb-1 ${!notification.read ? 'font-bold' : 'font-medium'}`}>{notification.title}</p>
                          <p className="text-xs text-on-surface-variant">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 bg-surface-container-lowest border-t border-outline-variant/10">
                      <button
                        onClick={() => {
                          setIsNotificationOpen(false);
                          navigate('/notifications');
                        }}
                        className="w-full py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                      >
                        View All
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Icon */}
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors border border-outline-variant/20"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>


      <div className="flex-grow">
        <Outlet />
      </div>


      {/* Bottom Nav for Mobile (Segmented Control Style) */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="flex items-center justify-between bg-surface-container-high/90 backdrop-blur-xl p-1.5 rounded-full border border-outline-variant/20 shadow-xl">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex-1 flex flex-col items-center justify-center py-2 rounded-full transition-colors ${
                  isActive ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute inset-0 bg-primary rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <Icon className="w-5 h-5 mb-0.5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold tracking-wider">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>


      {/* Full Width Footer */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-outline-variant/10 py-6 px-6 mt-auto pb-24 md:pb-6">
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant/60">© 2026 CredTurn. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => navigate('/terms')} className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors font-medium">Terms of Service</button>
            <button onClick={() => navigate('/privacy')} className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors font-medium">Privacy Policy</button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AnimatePresence>
        {selectedInvoice && <InvoiceModal key="invoice-modal" />}
        {selectedPayment && <PaymentModal key="payment-modal" />}
        {selectedUser && <UserModal key="user-modal" />}
        {isScoreModalOpen && <ScoreModal key="score-modal" />}
        <InvoiceSentModal key="sent-modal" />
        <IncomingInvoiceModal key="incoming-modal" />
      </AnimatePresence>
    </div>
  );
}
