import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RotatingInput from '../components/RotatingInput';
import AuthHeader from '../components/AuthHeader';
import SocialLoginButton from '../components/SocialLoginButton';


export default function Login() {
  const navigate = useNavigate();
  const [isSplash, setIsSplash] = useState(() => !sessionStorage.getItem('hasSeenSplash'));
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (isSplash) {
      const timer = setTimeout(() => {
        setIsSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSplash]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };


  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 min-h-screen bg-background text-on-background relative overflow-hidden">
      <AuthHeader isSplash={isSplash} />


      <AnimatePresence>
        {!isSplash && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container z-10"
          >
            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 ml-1" htmlFor="contact">Email or Phone</label>
                <RotatingInput
                  id="contact"
                  name="contact"
                  type="text"
                  placeholders={["Enter your email address", "Enter your phone number"]}
                />
              </div>


              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 ml-1" htmlFor="password">Password</label>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3.5 bg-surface-container-low border border-surface-container-high rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-slate-400 font-medium text-on-surface"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button type="button" onClick={() => navigate('/recover')} className="text-xs font-semibold text-on-surface-variant/70 hover:text-primary transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>


              <div className="pt-2">
                <button className="w-full py-3.5 bg-primary text-white font-headline font-bold text-base rounded-xl shadow-[0_4px_12px_rgba(0,108,73,0.2)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                  Log In
                </button>
              </div>
            </form>


            <SocialLoginButton />


            <p className="mt-8 text-center text-on-surface-variant text-sm font-medium">
              New to CredTurn?
              <button onClick={() => navigate('/signup')} className="text-primary font-bold hover:underline underline-offset-4 ml-1">Create an Account</button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#fdfdfd]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      </div>
    </main>
  );
}
