import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, TrendingUp, Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const SCORE_RANGES = [
  { min: 80, max: 100, label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100', desc: 'You have exceptional credit standing. Access premium rates.' },
  { min: 60, max: 79, label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100', desc: 'Good credit. Most lending partners will work with you.' },
  { min: 40, max: 59, label: 'Fair', color: 'text-amber-600', bg: 'bg-amber-100', desc: 'Build your score by paying invoices on time.' },
  { min: 0, max: 39, label: 'Low', color: 'text-red-600', bg: 'bg-red-100', desc: 'Focus on clearing overdue invoices to improve.' },
];

const SCORE_FACTORS = [
  { label: 'On-time Payments', desc: 'Pay before due date', impact: '+8 pts', icon: CheckCircle2, positive: true },
  { label: 'Full Invoice Clearance', desc: 'Clear 100% of invoice value', impact: '+5 pts', icon: ShieldCheck, positive: true },
  { label: 'Loan Repayment', desc: 'Via lending partners', impact: '+3 pts', icon: TrendingUp, positive: true },
  { label: 'Overdue Payment', desc: 'Paid after due date', impact: '-3 pts', icon: Clock, positive: false },
  { label: 'Expired Invoice', desc: 'Invoice not accepted', impact: '-2 pts', icon: AlertCircle, positive: false },
];

export default function ScoreDetailsPage() {
  const navigate = useNavigate();
  const { credTurnScore } = useAppContext();
  const range = SCORE_RANGES.find(r => credTurnScore >= r.min && credTurnScore <= r.max) ?? SCORE_RANGES[3];

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
      <div className="ct-page-header">
        <button onClick={() => navigate(-1)} className="ct-btn-back"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold font-headline text-on-surface">CredTurn Score</h1>
          <p className="text-sm text-on-surface-variant">Your credit trustworthiness in detail</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Score hero */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-8 text-center relative overflow-hidden shadow-2xl shadow-primary/25">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">Your Score</p>
          <div className="text-7xl font-extrabold text-white font-headline tracking-tighter mb-2">{credTurnScore}</div>
          <div className="text-white/80 text-sm mb-4">out of 100</div>
          <span className={`${range.bg} ${range.color} text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full`}>
            {range.label}
          </span>
          <p className="text-white/70 text-sm mt-4 max-w-xs mx-auto">{range.desc}</p>
          {/* Gauge bar */}
          <div className="mt-6 h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${credTurnScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>

        {/* Score ranges reference */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Score Ranges</p>
          </div>
          {SCORE_RANGES.map(r => (
            <div key={r.label} className={`flex items-center gap-3 px-5 py-3.5 border-b border-outline-variant/10 last:border-0 ${credTurnScore >= r.min && credTurnScore <= r.max ? 'bg-primary/5' : ''}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${r.bg.replace('bg-', 'bg-').replace('-100', '-500')} shrink-0`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${credTurnScore >= r.min && credTurnScore <= r.max ? r.color : 'text-on-surface'}`}>{r.label}</p>
                  {credTurnScore >= r.min && credTurnScore <= r.max && <span className="text-[9px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">YOU</span>}
                </div>
                <p className="text-xs text-on-surface-variant">{r.min}–{r.max} points</p>
              </div>
            </div>
          ))}
        </div>

        {/* How score changes */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/15 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">How Your Score Changes</p>
          </div>
          {SCORE_FACTORS.map(({ label, desc, impact, icon: Icon, positive }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-4 border-b border-outline-variant/10 last:border-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${positive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant">{desc}</p>
              </div>
              <span className={`text-sm font-extrabold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>{impact}</span>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/payments')} className="ct-btn-primary">
          <TrendingUp className="w-4 h-4" /> Improve My Score
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </main>
  );
}
