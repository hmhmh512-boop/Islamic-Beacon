
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuranEnhanced from './components/QuranEnhanced';
import AzkarEnhanced from './components/AzkarEnhanced';
import SunnahHadith from './components/SunnahHadith';
import Quiz from './components/Quiz';
import Assistant from './components/Assistant';
import Tasbih from './components/Tasbih';
import Login from './components/Login';
import PrayerTimes from './components/PrayerTimes';
import ZakatCalculator from './components/ZakatCalculator';
import HajjGuide from './components/HajjGuide';
import RamadanSpecial from './components/RamadanSpecial';
import RamadanDashboard from './components/RamadanDashboard';
import KhatmaPlanner from './components/KhatmaPlanner';
import TenDaysSpecial from './components/TenDaysSpecial';
import RamadanReminders from './components/RamadanReminders';
import Tasme_a from './components/Tasme_a';
import ProphetStories from './components/ProphetStories';
import FortyHadith from './components/FortyHadith';
import DailyMissionsAndWirds from './components/DailyMissionsAndWirds';
import OfflineIndicator from './components/OfflineIndicator';
import { AppTab, User } from './types';
import { FORTY_HADITH } from './constants';
import { PROPHET_STORIES } from './prophet-stories';
import { useTheme, ThemeProvider } from './context/ThemeContext';
import { isRamadanPeriod, isTenBlessedDays, getCurrentSeasonalMode } from './utils/seasonalModes';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [user, setUser] = useState<User>({ name: '', email: '', photo: '', isLoggedIn: false });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const saved = localStorage.getItem('noor_user_royal');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('noor_user_royal', JSON.stringify(newUser));
    setActiveTab(AppTab.DASHBOARD);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD: return <Dashboard setActiveTab={setActiveTab} />;
      case AppTab.QURAN: return <QuranEnhanced />;
      case AppTab.AZKAR: return <AzkarEnhanced />;
      case AppTab.HADITH: return <SunnahHadith />;
      case AppTab.QUIZ: return <Quiz />;
      case AppTab.ASSISTANT: return <Assistant />;
      case AppTab.TASBIH: return <Tasbih />;
      case AppTab.PRAYER_TIMES: return <PrayerTimes />;
      case AppTab.ZAKAT: return <ZakatCalculator />;
      case AppTab.HAJJ: return <HajjGuide />;
      case AppTab.TASME_A: return <Tasme_a />;
      case AppTab.DAILY_MISSIONS_AND_WIRDS: return <DailyMissionsAndWirds />;
      case AppTab.LOGIN: return <Login onLogin={handleLogin} />;
      
      case AppTab.RAMADAN_SPECIAL: return <RamadanSpecial />;
      case AppTab.RAMADAN_DASHBOARD: return <RamadanDashboard />;
      case AppTab.KHATMA_PLANNER: return <KhatmaPlanner />;
      case AppTab.TEN_DAYS_SPECIAL: return <TenDaysSpecial />;
      case AppTab.RAMADAN_REMINDERS: return <RamadanReminders />;

      case AppTab.FORTY_HADITH:
        return <FortyHadith />;

      case AppTab.HISN_ALMUSLIM:
        return (
          <div className={`space-y-6 animate-fade-in pb-24 px-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <h2 className="text-3xl font-black text-amber-500 quran-text text-center">حصن المسلم</h2>
            <AzkarEnhanced forcedCategory="حصن المسلم" />
          </div>
        );

      case AppTab.STORIES:
        return (
          <ProphetStories />
        );

      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      <OfflineIndicator />
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user}>
        {renderContent()}
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
