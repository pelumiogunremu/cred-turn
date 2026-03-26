import { Handshake } from 'lucide-react';
import { motion } from 'motion/react';


interface AuthHeaderProps {
  isSplash?: boolean;
}


export default function AuthHeader({ isSplash = false }: AuthHeaderProps) {
  return (
    <motion.header
      layout
      initial={false}
      animate={{
        marginBottom: isSplash ? 0 : "2rem"
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center z-20 w-full"
    >
      <motion.div layout className="mb-6">
        <motion.div
          animate={isSplash ? { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] } : { scale: 1, opacity: 1 }}
          transition={isSplash ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
          className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-2xl flex items-center justify-center shadow-[0_8px_20px_-6px_rgba(0,108,73,0.3)]"
        >
          <Handshake className="text-on-primary w-8 h-8" strokeWidth={2.5} />
        </motion.div>
      </motion.div>
      <motion.h1 layout className="font-headline font-extrabold text-3xl tracking-tight text-on-primary-container mb-2">
        CredTurn
      </motion.h1>
      <motion.p layout className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant/60">
        Reimagining Credit Transactions
      </motion.p>
    </motion.header>
  );
}
