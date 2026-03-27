import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Sparkles, ArrowLeft } from 'lucide-react';

export default function CardPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32 min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-extrabold font-headline text-on-surface">CredTurn Card</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated card visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-sm mb-12"
        >
          {/* Card face */}
          <div className="relative h-52 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-emerald-400 shadow-2xl shadow-primary/40 overflow-hidden p-6 flex flex-col justify-between">
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">CredTurn</p>
                <p className="text-white font-bold text-lg font-headline">Credit Card</p>
              </div>
              <CreditCard className="w-8 h-8 text-white/80" />
            </div>

            {/* Card number masked */}
            <div className="relative z-10">
              <p className="text-white/60 text-sm font-mono tracking-[0.3em] mb-3">•••• •••• •••• ••••</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-[9px] uppercase tracking-widest">Card Holder</p>
                  <p className="text-white font-bold text-sm">Coming Soon</p>
                </div>
                <div>
                  <p className="text-white/50 text-[9px] uppercase tracking-widest">Expires</p>
                  <p className="text-white font-bold text-sm">MM/YY</p>
                </div>
              </div>
            </div>

            {/* Shimmer overlay */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', repeatDelay: 2 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
          </div>
        </motion.div>

        {/* Coming soon message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">Coming Soon</span>
          </div>

          <h2 className="text-2xl font-bold font-headline text-on-surface">CredTurn Credit Card</h2>
          <p className="text-on-surface-variant max-w-xs mx-auto leading-relaxed">
            Get a virtual Credit card linked to your CredTurn credit balance. Pay merchants anywhere, anytime.
          </p>

          <div className="pt-6 grid grid-cols-1 gap-3 max-w-xs mx-auto text-left">
            {[
              { label: 'Instant payments anywhere', icon: CreditCard },
              { label: 'Secured by your CredTurn score', icon: Lock },
              { label: 'Track all card transactions', icon: Sparkles },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-3 bg-surface-container-low rounded-xl p-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-on-surface">{feature.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate(-1)}
          className="mt-10 ct-btn-secondary"
        >
          Go Back
        </motion.button>
      </div>
    </main>
  );
}
