import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';


interface RotatingInputProps {
  placeholders: string[];
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
}


export default function RotatingInput({ placeholders, className, onChange, ...props }: RotatingInputProps) {
  const [index, setIndex] = useState(0);
  const [hasValue, setHasValue] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (onChange) onChange(e);
  };


  return (
    <div className="relative w-full">
      <input
        className={`w-full px-4 py-3.5 bg-surface-container-low border border-surface-container-high rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all duration-200 font-medium text-on-surface relative z-10 bg-transparent ${className || ''}`}
        onChange={handleChange}
        {...props}
      />
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-0 overflow-hidden right-10">
        <AnimatePresence mode="wait">
          {!hasValue && (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="text-slate-400 text-sm truncate"
            >
              {placeholders[index]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
