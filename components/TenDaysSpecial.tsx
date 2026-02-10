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
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="p-6 rounded-2xl shadow-xl bg-gradient-to-b from-orange-700 to-red-900 text-white">
        <h2 className="text-3xl font-black mb-2">
          🕌 العشر الأوائل من ذي الحجة
        </h2>

        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div>
            <p className="text-xs">اليوم</p>
            <p className="text-2xl font-black">{dayNumber}</p>
          </div>
          <div>
            <p className="text-xs">المتبقي</p>
            <p className="text-2xl font-black">{daysRemaining}</p>
          </div>
          <div>
            <p className="text-xs">التقدم</p>
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
            className={`p-3 rounded-xl font-bold transition ${
              activeCategory === cat.key
                ? 'bg-orange-600 text-white'
                : 'bg-slate-200'
            }`}
          >
            {cat.emoji}
            <br />
            {cat.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {filteredContent.map(item => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border shadow bg-white"
          >
            <h3 className="text-xl font-black mb-3">
              {item.titleArabic}
            </h3>

            <p className="text-lg font-bold mb-4 text-right">
              {item.content}
            </p>

            {item.spiritualGuidance && (
              <p className="text-sm opacity-70">
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
              className="mt-4 px-4 py-2 rounded-lg bg-orange-200 font-bold"
            >
              📝 ملاحظة
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenDaysSpecial;
