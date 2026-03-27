import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';

export default function SecurityPage() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPass: false, confirm: false });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!form.current || !form.newPass || !form.confirm) {
      showToast('Please fill in all fields', 'error'); return;
    }
    if (form.newPass !== form.confirm) {
      showToast('New passwords do not match', 'error'); return;
    }
    if (form.newPass.length < 8) {
      showToast('Password must be at least 8 characters', 'error'); return;
    }
    setSaved(true);
    showToast('Password updated successfully', 'success');
    setTimeout(() => { setSaved(false); setForm({ current: '', newPass: '', confirm: '' }); navigate('/profile'); }, 1500);
  };

  const PasswordField = ({ label, field, showKey }: { label: string; field: 'current' | 'newPass' | 'confirm'; showKey: 'current' | 'newPass' | 'confirm' }) => (
    <div>
      <label className="ct-label">{label}</label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50 pointer-events-none" />
        <input
          type={show[showKey] ? 'text' : 'password'}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="ct-input pl-11 pr-12"
          placeholder="••••••••"
        />
        <button type="button" onClick={() => setShow({ ...show, [showKey]: !show[showKey] })}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-primary transition-colors">
          {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const strength = form.newPass.length === 0 ? 0 : form.newPass.length < 6 ? 1 : form.newPass.length < 10 ? 2 : 3;
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'][strength];
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength];

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
      <div className="ct-page-header">
        <button onClick={() => navigate(-1)} className="ct-btn-back"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold font-headline text-on-surface">Security & Password</h1>
          <p className="text-sm text-on-surface-variant">Change your account password</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-on-surface leading-relaxed">
            For your security, use a unique password with at least 8 characters, including numbers and symbols.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/15 space-y-5">
          <PasswordField label="Current Password" field="current" showKey="current" />
          <PasswordField label="New Password" field="newPass" showKey="newPass" />
          {form.newPass && (
            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((n) => (
                  <div key={n} className={`h-1.5 flex-1 rounded-full transition-all ${n <= strength ? strengthColor : 'bg-surface-container-high'}`} />
                ))}
              </div>
              <p className={`text-xs font-bold ${['', 'text-red-500', 'text-amber-500', 'text-emerald-600'][strength]}`}>{strengthLabel}</p>
            </div>
          )}
          <PasswordField label="Confirm New Password" field="confirm" showKey="confirm" />
        </div>

        <button onClick={handleSave} className={`ct-btn-primary ${saved ? 'bg-emerald-600' : ''}`}>
          {saved ? <><Check className="w-4 h-4" /> Password Updated!</> : <><Lock className="w-4 h-4" /> Update Password</>}
        </button>
      </motion.div>
    </main>
  );
}
