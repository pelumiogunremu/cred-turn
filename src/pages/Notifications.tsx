import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PageHeader } from '../components/ui';

export default function Notifications() {
  const navigate = useNavigate();
  const { invoices, notifications, setSelectedInvoice, setIsScoreModalOpen, setSelectedPayment } = useAppContext();

  const handleNotificationClick = (notification: any) => {
    if (notification.type === 'invoice') {
      const invoiceId = notification.title.match(/INV-\d+-\d+/)?.[0] || 'c1';
      const invoice = invoices.find(inv => inv.reference === invoiceId) || invoices[0];
      setSelectedInvoice(invoice);
    } else if (notification.type === 'score') {
      setIsScoreModalOpen(true);
    } else {
      setSelectedPayment({ id: notification.id, title: notification.title });
    }
  };


  return (
    <main className="max-w-3xl mx-auto px-6 pt-8 pb-32">
      <PageHeader title="Notifications" onBack={() => navigate(-1)} />


      {notifications.length > 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="divide-y divide-outline-variant/10">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-surface-container-low cursor-pointer transition-colors flex items-start gap-4 ${!notification.read ? 'bg-primary/5' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center shrink-0 mt-1">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className={`text-sm text-on-surface mb-1 ${!notification.read ? 'font-bold' : 'font-medium'}`}>{notification.title}</p>
                  <p className="text-xs text-on-surface-variant">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary-container/30 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-on-surface mb-2">You're all caught up!</h2>
          <p className="text-on-surface-variant text-sm max-w-xs">
            You don't have any new notifications at the moment. Check back later for updates.
          </p>
        </div>
      )}
    </main>
  );
}
