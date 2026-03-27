import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, BellOff, MessageSquare, Mail, Smartphone, TrendingUp } from 'lucide-react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${checked ? 'bg-primary' : 'bg-surface-container-high'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );
}

export default function NotificationPrefsPage() {
  const navigate = useNavigate();
  const { notificationsEnabled, setNotificationsEnabled, showToast } = useAppContext();

  const handleToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    showToast(enabled ? 'Push notifications enabled ✓' : 'Notifications disabled', enabled ? 'success' : 'info');
  };

  const CHANNELS = [
    { label: 'Invoice Updates', desc: 'Accepted, rejected, or expiring invoices', icon: Bell, key: 'invoices' },
    { label: 'Payment Confirmations', desc: 'Successful or failed payment alerts', icon: MessageSquare, key: 'payments' },
    { label: 'Score Changes', desc: 'When your CredTurn score goes up or down', icon: TrendingUp, key: 'score' },
    { label: 'Email Notifications', desc: 'Summary emails to your registered email', icon: Mail, key: 'email' },
    { label: 'SMS Alerts', desc: 'Critical alerts sent to your phone', icon: Smartphone, key: 'sms' },
  ];

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
      <div className="ct-page-header">
        <button onClick={() => navigate(-1)} className="ct-btn-back"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold font-headline text-on-surface">Notification Settings</h1>
          <p className="text-sm text-on-surface-variant">Control your alerts and updates</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Master toggle */}
        <div className={`rounded-2xl p-5 border flex items-center gap-4 transition-all ${notificationsEnabled ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-lowest border-outline-variant/15'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notificationsEnabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
            {notificationsEnabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-on-surface">Push Notifications</p>
            <p className="text-xs text-on-surface-variant">{notificationsEnabled ? 'You will receive alerts' : 'All notifications are off'}</p>
          </div>
          <Toggle checked={notificationsEnabled} onChange={handleToggle} />
        </div>

        {/* Individual channels */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Notification Channels</p>
          </div>
          {CHANNELS.map(({ label, desc, icon: Icon, key }, i) => (
            <div key={key} className={`flex items-center gap-4 px-5 py-4 ${i < CHANNELS.length - 1 ? 'border-b border-outline-variant/10' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant truncate">{desc}</p>
              </div>
              <Toggle
                checked={notificationsEnabled}
                onChange={(v) => { if (!notificationsEnabled && v) handleToggle(true); }}
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-on-surface-variant text-center px-4">
          Notification preferences are saved automatically across sessions.
        </p>
      </motion.div>
    </main>
  );
}
