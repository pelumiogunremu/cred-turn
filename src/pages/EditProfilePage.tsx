import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { ArrowLeft, User, Phone, Mail, Building2, MapPin, Save, Check } from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, showToast } = useAppContext();
  const [form, setForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    business: (userProfile as any).business || '',
    location: (userProfile as any).location || 'Lagos, Nigeria',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUserProfile({ ...userProfile, name: form.name, email: form.email, phone: form.phone });
    setSaved(true);
    showToast('Profile updated successfully', 'success');
    setTimeout(() => { setSaved(false); navigate('/profile'); }, 1200);
  };

  const Field = ({ label, icon: Icon, type = 'text', value, field }: any) => (
    <div>
      <label className="ct-label">{label}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50 pointer-events-none" />
        <input
          type={type}
          value={value}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          className="ct-input pl-11"
        />
      </div>
    </div>
  );

  return (
    <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
      <div className="ct-page-header">
        <button onClick={() => navigate(-1)} className="ct-btn-back"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold font-headline text-on-surface">Edit Profile</h1>
          <p className="text-sm text-on-surface-variant">Update your personal information</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/15 space-y-5">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Personal Details</h2>
          <Field label="Full Name" icon={User} value={form.name} field="name" />
          <Field label="Email Address" icon={Mail} type="email" value={form.email} field="email" />
          <Field label="Phone Number" icon={Phone} type="tel" value={form.phone} field="phone" />
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/15 space-y-5">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Business Info</h2>
          <Field label="Business / Company Name" icon={Building2} value={form.business} field="business" />
          <Field label="Location" icon={MapPin} value={form.location} field="location" />
        </div>

        <button
          onClick={handleSave}
          className={`ct-btn-primary transition-all ${saved ? 'bg-emerald-600' : ''}`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </motion.div>
    </main>
  );
}
