import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import RotatingInput from '../components/RotatingInput';
import AuthHeader from '../components/AuthHeader';


export default function Recover() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);


  const handleRecover = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
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


      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-surface-container z-10">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-4"
          >
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">Reset link sent successfully</h2>
              <p className="text-on-surface-variant font-medium">Check your email or phone for the recovery link.</p>
            </div>


            <div className="pt-6 space-y-4">
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full py-3.5 bg-surface-container-low text-on-surface font-bold text-base rounded-xl hover:bg-surface-container-high transition-colors"
              >
                Resend Link
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3.5 bg-primary text-white font-headline font-bold text-base rounded-xl shadow-[0_4px_12px_rgba(0,108,73,0.2)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200"
              >
                Back to Login
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold text-on-surface mb-2">Forgot Password?</h2>
              <p className="text-sm text-on-surface-variant font-medium">Enter your details to receive a reset link.</p>
            </div>
           
            <form className="space-y-6" onSubmit={handleRecover}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80 ml-1" htmlFor="contact">Email or Phone</label>
                <RotatingInput
                  id="contact"
                  name="contact"
                  type="text"
                  placeholders={["Enter your email address", "Enter your phone number"]}
                />
              </div>


              <div className="pt-2">
                <button className="w-full py-3.5 bg-primary text-white font-headline font-bold text-base rounded-xl shadow-[0_4px_12px_rgba(0,108,73,0.2)] hover:bg-surface-tint active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2" type="submit">
                  Send Reset Link
                </button>
              </div>
            </form>


            <p className="mt-8 text-center text-on-surface-variant text-sm font-medium">
              Remembered your password?
              <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline underline-offset-4 ml-1">Log In</button>
            </p>
          </motion.div>
        )}
      </div>


      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden bg-[#fdfdfd]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[80px]"></div>
      </div>
    </main>
  );
}
