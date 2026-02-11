import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  isTenBlessedDays,
  getDayInTenDays,
  getDaysRemainingInTenDays,
} from '../utils/seasonalModes';
import { TEN_BLESSED_DAYS_CONTENT } from '../constants/ramadanContent';

const TenDaysSpecial: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('morning');
  const [notes, setNotes] = useState<Record<string, string>>({});

  const categories = [
    { key: 'morning', label: '🌅 الصباح', emoji: '☀️' },
    { key: 'evening', label: '🌙 المساء', emoji: '🌙' },
    { key: 'qiyam', label: '✨ القيام', emoji: '🌃' },
    { key: 'dua', label: '🤲 الدعاء', emoji: '💫' },
    { key: 'action', label: '⚡ العمل', emoji: '🎯' },
  ];

  const dayNumber = getDayInTenDays();
  const daysRemaining = getDaysRemainingInTenDays();

  if (!isTenBlessedDays() || !dayNumber) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl font-bold">🕌 العشر الأوائل من ذي الحجة</p>
        <p className="mt-2 text-sm opacity-70">
          سيتم تفعيل المحتوى تلقائيًا عند دخول العشر المباركة
        </p>
      </div>
    );
  }

  const filteredContent = TEN_BLESSED_DAYS_CONTENT.filter(
    item => item.category === activeCategory && item.day === dayNumber
  );

  return (
    <div className={`space-y-6 pb-32 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`p-6 rounded-2xl shadow-xl ${isDark ? 'bg-gradient-to-b from-orange-900 to-red-950 border-orange-700/30' : 'bg-gradient-to-b from-orange-700 to-red-900'} text-white border-b-4`}>
        <h2 className="text-3xl font-black mb-2 quran-text">
          🕌 العشر الأوائل من ذي الحجة
        </h2>

        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div>
            <p className="text-[10px] font-black uppercase opacity-70">اليوم</p>
            <p className="text-2xl font-black">{dayNumber}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-70">المتبقي</p>
            <p className="text-2xl font-black">{daysRemaining}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase opacity-70">التقدم</p>
            <p className="text-2xl font-black">
              {Math.round((dayNumber / 10) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 px-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`p-3 rounded-xl font-bold transition-all active:scale-95 border-b-4 ${
              activeCategory === cat.key
                ? 'bg-orange-600 text-white border-orange-800'
                : (isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-300')
            }`}
          >
            {cat.emoji}
            <br />
            <span className="text-[10px]">{cat.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {filteredContent.map(item => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border-b-4 shadow-xl transition-all ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <h3 className="text-xl font-black mb-3 text-orange-500 quran-text">
              {item.titleArabic}
            </h3>

            <div className={`${isDark ? 'bg-black/20' : 'bg-orange-50/30'} p-4 rounded-xl mb-4`}>
              <p className="text-lg font-bold text-right quran-text leading-relaxed">
                {item.content}
              </p>
            </div>

            {item.spiritualGuidance && (
              <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                💡 {item.spiritualGuidance}
              </p>
            )}

            <button
              onClick={() => {
                const note = prompt('أضف ملاحظة:', notes[item.id] || '');
                if (note !== null) {
                  setNotes(prev => ({ ...prev, [item.id]: note }));
                }
              }}
              className={`mt-6 px-6 py-2 rounded-xl font-black text-[10px] transition-all active:scale-95 ${
                isDark ? 'bg-orange-900/40 text-orange-400 border border-orange-800' : 'bg-orange-100 text-orange-700 border border-orange-200'
              }`}
            >
              📝 إضافة ملاحظة خاصة
            </button>
          </div>
        ))}

        {filteredContent.length === 0 && (
          <div className={`text-center p-12 rounded-2xl ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
            <p className="text-sm font-bold opacity-50">لا يوجد محتوى لهذه الفئة اليوم</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenDaysSpecial;
