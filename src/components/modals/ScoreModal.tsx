import { motion } from 'motion/react';
import { X, ShieldCheck, Landmark, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function ScoreModal() {
  const navigate = useNavigate();
  const { isScoreModalOpen, setIsScoreModalOpen, credTurnScore, invoices } = useAppContext();
  
  if (!isScoreModalOpen) return null;

  const overdueCount = invoices.filter(inv => inv.status === 'Overdue').length;
  
  const getConsistencyLabel = () => {
    if (invoices.length === 0) return 'None';
    if (credTurnScore >= 80) return 'Excellent';
    if (credTurnScore >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-headline">CredTurn Score</h2>
          <button onClick={() => setIsScoreModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-surface-container-high" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (credTurnScore / 100))} strokeLinecap="round" className="text-primary drop-shadow-md transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-primary">{credTurnScore}</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Score</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-on-surface">Access to Credit</h3>
            <p className="text-sm text-on-surface-variant px-4">Your score determines your credit limits and interest rates across the platform.</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-bold text-on-surface text-sm">Payment Consistency</p>
                  <p className="text-xs text-on-surface-variant">On-time payments</p>
                </div>
              </div>
              <span className="text-primary font-bold text-sm">{getConsistencyLabel()}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-on-surface text-sm">Default History</p>
                  <p className="text-xs text-on-surface-variant">Past defaults</p>
                </div>
              </div>
              <span className="text-emerald-600 font-bold text-sm">{overdueCount} {overdueCount === 1 ? 'Default' : 'Defaults'}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsScoreModalOpen(false);
              navigate('/payments');
            }}
            className="w-full bg-primary text-on-primary font-bold py-4 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Increase CredTurn Score
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
