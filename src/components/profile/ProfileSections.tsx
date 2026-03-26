import React, { useState } from 'react';
import { Edit2, ShieldCheck, TrendingUp, User, Shield, Wallet, Building2, Bell, Moon, HelpCircle, FileText, ShieldAlert, LogOut, ExternalLink, Camera, Check } from 'lucide-react';
import { motion } from 'motion/react';
import SettingsItem from '../SettingsItem';

export function ProfileHeader({ 
  userProfile, 
  setUserProfile,
  fileInputRef, 
  onImageUpload 
}: { 
  userProfile: any; 
  setUserProfile: any;
  fileInputRef: React.RefObject<HTMLInputElement>; 
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editPhone, setEditPhone] = useState(userProfile.phone);

  const handleSave = () => {
    setUserProfile({ ...userProfile, name: editName, phone: editPhone });
    setIsEditing(false);
  };

  return (
    <section className="flex flex-col items-center text-center space-y-6">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-primary-container shadow-xl">
          {userProfile.profileImage ? (
            <img alt={userProfile.name} className="w-full h-full object-cover rounded-full border-4 border-surface" src={userProfile.profileImage} />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-surface bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <User className="w-16 h-16" />
            </div>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 right-1 bg-primary text-on-primary p-2.5 rounded-full border-2 border-surface shadow-lg cursor-pointer hover:bg-primary/90 transition-all transform hover:scale-110 active:scale-95"
        >
          <Camera className="w-4 h-4" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onImageUpload} 
          className="hidden" 
          accept="image/*"
        />
      </div>
      <div className="w-full max-w-sm bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 relative">
        {!isEditing ? (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">{userProfile.name}</h2>
            <p className="text-on-surface-variant font-medium mt-1">{userProfile.phone}</p>
            <p className="text-primary font-bold text-xs uppercase tracking-widest mt-3 bg-primary/10 inline-block px-3 py-1 rounded-full">Verified Account</p>
          </>
        ) : (
          <div className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">First Name</label>
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">Phone Number</label>
              <input 
                type="text" 
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <button 
              onClick={handleSave}
              className="w-full bg-primary text-on-primary py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Check className="w-4 h-4" /> Save Changes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export function CredTurnScoreSection({ 
  credTurnScore, 
  onOpenScoreModal, 
  onNavigateToPayments 
}: { 
  credTurnScore: number; 
  onOpenScoreModal: () => void; 
  onNavigateToPayments: () => void;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        onClick={onOpenScoreModal}
        className="bg-surface-container-lowest p-6 rounded-2xl flex flex-col justify-between items-start transition-all hover:bg-surface-bright border border-outline-variant/10 hover:border-primary/30 cursor-pointer group"
      >
        <div className="w-full flex justify-between items-start mb-6">
          <div className="bg-primary/10 p-2 rounded-xl">
            <ShieldCheck className="text-primary w-6 h-6" />
          </div>
          <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {credTurnScore >= 70 ? 'High Trust' : credTurnScore >= 50 ? 'Medium Trust' : 'Low Trust'}
          </span>
        </div>
        <div>
          <p className="text-on-surface-variant text-sm font-bold mb-1">CredTurn Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-primary tracking-tighter">{credTurnScore}</span>
            <span className="text-on-surface-variant text-xl font-bold">/100</span>
          </div>
        </div>
        <div className="mt-6 w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${credTurnScore}%` }}
            className="h-full bg-gradient-to-r from-primary to-primary-container"
          />
        </div>
      </div>

      <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl flex flex-col justify-between items-center text-center space-y-4 border border-primary/10">
        <div className="flex flex-col items-center space-y-2">
          <TrendingUp className="w-10 h-10 text-primary" />
          <h3 className="font-bold text-lg">Access to Credit</h3>
          <p className="text-sm opacity-90 leading-relaxed font-medium">Your score increased by 4 points this month. Keep it up!</p>
        </div>
        <button 
          onClick={onNavigateToPayments}
          className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
        >
          Increase CredTurn Score
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export function AccountSettingsSection() {
  return (
    <section className="space-y-4">
      <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-2">Account Settings</h3>
      <div className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col border border-outline-variant/5">
        <SettingsItem label="Personal Information" icon={User} onClick={() => {}} />
        <SettingsItem label="Security & Password" icon={Shield} onClick={() => {}} />
        <SettingsItem label="Payment Methods" icon={Wallet} onClick={() => {}} />
        <SettingsItem label="Linked Bank Accounts" icon={Building2} onClick={() => {}} />
      </div>
    </section>
  );
}

export function AppPreferencesSection({ 
  notificationsEnabled, 
  setNotificationsEnabled, 
  isDarkMode, 
  setIsDarkMode 
}: { 
  notificationsEnabled: boolean; 
  setNotificationsEnabled: (enabled: boolean) => void; 
  isDarkMode: boolean; 
  setIsDarkMode: (enabled: boolean) => void;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-2">App Preferences</h3>
      <div className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col border border-outline-variant/5">
        <SettingsItem 
          label="Notifications" 
          icon={Bell} 
          isToggle={true} 
          checked={notificationsEnabled} 
          onChange={setNotificationsEnabled}
        />
        <SettingsItem 
          label="Dark Mode" 
          icon={Moon} 
          isToggle={true} 
          checked={isDarkMode} 
          onChange={setIsDarkMode}
        />
      </div>
    </section>
  );
}

export function SupportLegalSection({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <section className="space-y-4">
      <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-2">Support & Legal</h3>
      <div className="bg-surface-container-low rounded-2xl overflow-hidden flex flex-col border border-outline-variant/5">
        <SettingsItem label="Help Center" icon={HelpCircle} onClick={() => {}} />
        <SettingsItem label="Terms of Service" icon={FileText} onClick={() => onNavigate('/terms')} />
        <SettingsItem label="Privacy Policy" icon={ShieldAlert} onClick={() => onNavigate('/privacy')} />
      </div>
    </section>
  );
}

export function LogoutSection({ onLogout }: { onLogout: () => void }) {
  return (
    <section className="pb-8">
      <button onClick={onLogout} className="w-full py-4 rounded-xl border-2 border-error/20 text-error font-bold tracking-wide hover:bg-error/5 transition-colors flex items-center justify-center gap-2 group">
        <LogOut className="w-5 h-5 group-active:translate-x-1 transition-transform" />
        Logout
      </button>
    </section>
  );
}