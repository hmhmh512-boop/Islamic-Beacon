
import React, { useEffect, useState } from 'react';
import { AppTab, User } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  user: User;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, user, children }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNavMenu, setShowNavMenu] = useState(false);

  const navItems = [
    { tab: AppTab.DASHBOARD, icon: '🏠', label: 'الرئيسية', color: 'emerald' },
    { tab: AppTab.QURAN, icon: '📖', label: 'القرآن', color: 'blue' },
    { tab: AppTab.AZKAR, icon: '📿', label: 'الأذكار', color: 'amber' },
    { tab: AppTab.PRAYER_TIMES, icon: '🕌', label: 'الصلاة', color: 'green' },
    { tab: AppTab.DAILY_MISSIONS_AND_WIRDS, icon: '⭐', label: 'المهمات', color: 'purple' }
  ];

  const getDynamicClasses = () => {
    if (theme === 'dark') {
      return {
        bg: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950',
        header: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950',
        surface: 'bg-slate-900/80',
        text: 'text-slate-100',
        textSecondary: 'text-slate-400',
        border: 'border-emerald-900/30',
        navBg: 'bg-slate-950/90 backdrop-blur-xl',
        accent: 'text-amber-400'
      };
    } else {
      return {
        bg: 'bg-gradient-to-b from-green-50 via-slate-50 to-green-50',
        header: 'bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600',
        surface: 'bg-white border border-emerald-200',
        text: 'text-slate-900',
        textSecondary: 'text-slate-600',
        border: 'border-emerald-200',
        navBg: 'bg-white/90 backdrop-blur-xl border-t border-emerald-200',
        accent: 'text-emerald-700'
      };
    }
  };

  const classes = getDynamicClasses();

  return (
    <div className={`flex flex-col h-screen w-full relative overflow-hidden transition-all duration-300 ${classes.bg}`}>
      {/* Header - Fully Responsive */}
      <header className={`${classes.header} py-3 sm:py-4 px-4 sm:px-6 shrink-0 shadow-2xl z-40 border-b ${classes.border}`}>
        <div className="flex justify-between items-center w-full">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {activeTab !== AppTab.DASHBOARD && (
              <button 
                onClick={() => setActiveTab(AppTab.DASHBOARD)}
                className={`flex-shrink-0 w-8 sm:w-9 h-8 sm:h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-white/30 hover:bg-white/40 text-white border border-white/30'
                }`}
              >
                ←
              </button>
            )}
            <div className="text-right min-w-0">
              <h1 className={`text-base sm:text-lg font-black quran-text drop-shadow-md leading-tight ${classes.accent}`}>
                نور الهدى
              </h1>
              <p className={`text-[6px] sm:text-[7px] font-black tracking-widest uppercase mt-0.5 opacity-70 ${
                theme === 'dark' ? 'text-white/50' : 'text-white/70'
              }`}>
                تطبيق إسلامي شامل
              </p>
            </div>
          </div>

          {/* Right Section - Theme Toggle & User */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`w-8 sm:w-9 h-8 sm:h-9 rounded-lg flex items-center justify-center text-base sm:text-lg transition-all active:scale-90 ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/20 text-amber-300 border border-white/20'
                  : 'bg-white/30 hover:bg-white/40 text-white border border-white/30'
              }`}
              title={theme === 'dark' ? 'وضع فاتح' : 'وضع داكن'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* User Profile / Login */}
            {user.isLoggedIn ? (
              <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full transition-all ${
                theme === 'dark'
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/30 border border-white/30'
              }`}>
                <img 
                  src={user.photo} 
                  alt="User" 
                  className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 ${
                    theme === 'dark' ? 'border-amber-400' : 'border-white'
                  }`}
                />
                <span className={`text-[7px] sm:text-[8px] font-black max-w-[50px] sm:max-w-[70px] truncate ${
                  theme === 'dark' ? 'text-white' : 'text-white'
                }`}>
                  {user.name}
                </span>
              </div>
            ) : (
              <button 
                onClick={() => setActiveTab(AppTab.LOGIN)} 
                className={`text-[7px] sm:text-[8px] font-black px-2 sm:px-3 py-1.5 rounded-lg transition-all active:scale-90 ${
                  theme === 'dark'
                    ? 'bg-amber-500 text-emerald-950 hover:bg-amber-400'
                    : 'bg-white text-emerald-700 hover:bg-green-50'
                }`}
              >
                دخول
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area - Fully Responsive */}
      <main className={`flex-1 w-full overflow-y-auto overflow-x-hidden scroll-smooth transition-all duration-300 pb-32 sm:pb-40 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-b from-green-50 via-slate-50 to-green-50'
      }`}>
        <div className="w-full max-w-full px-2 sm:px-4 py-4 sm:py-6">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Fixed and Responsive */}
      <nav className={`fixed bottom-0 left-0 right-0 ${classes.navBg} z-50 border-t ${classes.border}`}>
        {/* Main Nav Items */}
        <div className="max-w-2xl mx-auto px-2 sm:px-4 py-2 flex justify-around items-stretch">
          {navItems.map(item => (
            <button 
              key={item.tab}
              onClick={() => {
                setActiveTab(item.tab);
                setShowNavMenu(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-16 sm:h-20 rounded-t-2xl transition-all duration-200 relative group ${
                activeTab === item.tab
                  ? theme === 'dark'
                    ? 'bg-gradient-to-b from-emerald-900/50 to-emerald-950/30'
                    : 'bg-gradient-to-b from-emerald-100 to-emerald-50'
                  : 'opacity-50 hover:opacity-75'
              }`}
            >
              {/* Icon */}
              <span className={`text-2xl sm:text-3xl mb-1 transition-transform duration-200 ${
                activeTab === item.tab ? 'scale-110' : 'group-hover:scale-105'
              }`}>
                {item.icon}
              </span>

              {/* Label */}
              <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-wide transition-colors duration-200 ${
                activeTab === item.tab
                  ? theme === 'dark'
                    ? 'text-emerald-400'
                    : 'text-emerald-700'
                  : theme === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}>
                {item.label}
              </span>

              {/* Active Indicator */}
              {activeTab === item.tab && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-all duration-200 ${
                  theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'
                }`} />
              )}
            </button>
          ))}
        </div>

        {/* Safe Area Spacer for Mobile */}
        <div className="h-2 sm:h-1" />
      </nav>


    </div>
  );
};

export default Layout;
