import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import RotatingInput from '../components/RotatingInput';
import AuthHeader from '../components/AuthHeader';
import SocialLoginButton from '../components/SocialLoginButton';


export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };


  return (
    <main className="flex-grow flex flex-col items-center justify-center px-6 min-h-screen bg-background text-on-background relative overflow-hidden">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors z-50"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>


      <AuthHeader />


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container z-10"
      >
        <form className="space-y-5" onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 ml-1" htmlFor="firstName">First Name</label>
              <input
                className="w-full px-4 py-3.5 bg-surface-container-low border border-surface-container-high rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-slate-400 font-medium text-on-surface"
                id="firstName"
                name="firstName"
                placeholder="John"
                type="text"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 ml-1" htmlFor="lastName">Last Name</label>
              <input
                className="w-full px-4 py-3.5 bg-surface-container-low border border-surface-container-high rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 placeholder:text-slate-400 font-medium text-on-surface"
                id="lastName"
                name="lastName"
                placeholder="Doe"
                type="text"
              />
            </div>
          </div>


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
            <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 ml-1" htmlFor="password">Password</label>
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
          </div>


          <div className="pt-2">
            <button className="w-full py-3.5 bg-primary text-white font-headline font-bold text-base rounded-xl shadow-[0_4px_12px_rgba(0,108,73,0.2)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" type="submit">
              Create Account
            </button>
          </div>
        </form>


        <SocialLoginButton />


        <p className="mt-8 text-center text-on-surface-variant text-sm font-medium">
          Already have an account?
          <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline underline-offset-4 ml-1">Log In</button>
        </p>
      </motion.div>


      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#fdfdfd]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      </div>
    </main>
  );
}
