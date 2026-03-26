import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  ProfileHeader, 
  CredTurnScoreSection, 
  AccountSettingsSection, 
  AppPreferencesSection, 
  SupportLegalSection, 
  LogoutSection 
} from '../components/profile/ProfileSections';

export default function Profile() {
  const navigate = useNavigate();
  const { 
    userProfile, 
    setUserProfile, 
    credTurnScore, 
    setIsScoreModalOpen,
    isDarkMode,
    setIsDarkMode,
    notificationsEnabled,
    setNotificationsEnabled
  } = useAppContext();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile({ ...userProfile, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="pt-8 px-6 max-w-2xl mx-auto space-y-8 pb-32">
      <ProfileHeader 
        userProfile={userProfile} 
        setUserProfile={setUserProfile}
        fileInputRef={fileInputRef} 
        onImageUpload={handleImageUpload} 
      />

      <CredTurnScoreSection 
        credTurnScore={credTurnScore} 
        onOpenScoreModal={() => setIsScoreModalOpen(true)} 
        onNavigateToPayments={() => navigate('/payments')} 
      />

      <AccountSettingsSection />

      <AppPreferencesSection 
        notificationsEnabled={notificationsEnabled} 
        setNotificationsEnabled={setNotificationsEnabled} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
      />

      <SupportLegalSection onNavigate={navigate} />

      <LogoutSection onLogout={() => navigate('/login')} />
    </main>
  );
}
