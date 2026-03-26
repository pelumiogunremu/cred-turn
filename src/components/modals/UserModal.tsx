import { motion } from 'motion/react';
import { X, User } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function UserModal() {
  const { selectedUser, setSelectedUser } = useAppContext();

  if (!selectedUser) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-2xl border border-outline-variant/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-headline">Contact Details</h2>
          <button onClick={() => setSelectedUser(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-on-surface-variant">
            <User className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-on-surface">{selectedUser.name}</h3>
            <p className="text-on-surface-variant">Verified Business Partner</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="bg-surface-container-low p-3 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Trust Score</p>
              <p className="text-lg font-bold text-primary">98/100</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-2xl">
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Transactions</p>
              <p className="text-lg font-bold text-on-surface">12</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-primary text-on-primary font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              Send Invoice
            </button>
            <button className="flex-1 bg-surface-container-low text-on-surface font-bold py-3 rounded-xl hover:bg-surface-container-high transition-colors">
              Message
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
