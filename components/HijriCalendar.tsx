import React, { useEffect, useState } from 'react';
import { ISLAMIC_CALENDAR_EVENTS, gregorianToHijri, formatHijriDate, getNextIslamicEvent } from '../interactive-tools-data';

interface EventNote {
  eventName: string;
  note: string;
  date: string;
}

const HijriCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriInfo, setHijriInfo] = useState({ year: 0, month: 0, day: 0 });
  const [gregorianDisplay, setGregorianDisplay] = useState('');
  const [eventNotes, setEventNotes] = useState<Record<string, string>>({});
  const [showNoteForm, setShowNoteForm] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [selectedEventTab, setSelectedEventTab] = useState<number>(0);
  const [nextEvent, setNextEvent] = useState<typeof ISLAMIC_CALENDAR_EVENTS[0] | null>(null);

  // Initialize
  useEffect(() => {
    updateCurrentDate();
    loadNotes();

    const interval = setInterval(() => {
      updateCurrentDate();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const updateCurrentDate = () => {
    const now = new Date();
    setCurrentDate(now);
    const hijri = gregorianToHijri(now);
    setHijriInfo(hijri);
    setGregorianDisplay(now.toLocaleDateString('ar-SA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    const next = getNextIslamicEvent();
    setNextEvent(next);
  };

  const loadNotes = () => {
    try {
      const saved = localStorage.getItem('hijri_event_notes');
      if (saved) {
        setEventNotes(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load notes', e);
    }
  };

  const saveNote = (eventName: string, note: string) => {
    const updated = { ...eventNotes, [eventName]: note };
    setEventNotes(updated);
    try {
      localStorage.setItem('hijri_event_notes', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save note', e);
    }
  };

  const addOrUpdateNote = (eventName: string) => {
    if (noteInput.trim()) {
      saveNote(eventName, noteInput);
      setNoteInput('');
      setShowNoteForm(null);
    }
  };

  const deleteNote = (eventName: string) => {
    const updated = { ...eventNotes };
    delete updated[eventName];
    setEventNotes(updated);
    try {
      localStorage.setItem('hijri_event_notes', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to delete note', e);
    }
  };

  const getColorClasses = (type: string) => {
    switch(type) {
      case 'holiday': return 'from-red-900 to-red-800 border-red-600';
      case 'observance': return 'from-purple-900 to-purple-800 border-purple-600';
      case 'historical': return 'from-blue-900 to-blue-800 border-blue-600';
      default: return 'from-emerald-900 to-emerald-800 border-emerald-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'holiday': return '🎉 عطلة';
      case 'observance': return '📿 مناسبة';
      case 'historical': return '📖 حدث';
      default: return '⭐ شخصي';
    }
  };

  const daysInMonths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  const monthNames = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 
                      'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
  const arabicMonthName = monthNames[hijriInfo.month - 1];

  // Get events for current month
  const currentMonthEvents = ISLAMIC_CALENDAR_EVENTS.filter(e => e.hijriMonth === hijriInfo.month);

  return (
    <div className="animate-fade-in space-y-8 pb-32 w-full">
      {/* Main Calendar Card */}
      <div className="mx-2 rounded-[3rem] p-10 bg-gradient-to-br from-indigo-950 to-indigo-900 shadow-2xl border-b-8 border-indigo-600 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-6xl opacity-10">📅</div>

        {/* Today's Hijri Date */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black quran-text text-amber-400 glow-gold mb-4">
            {hijriInfo.day} {arabicMonthName}
          </h1>
          <p className="text-3xl font-black text-amber-300 mb-4">{hijriInfo.year} ه</p>
          <p className="text-slate-300 text-[10px] font-black uppercase">التاريخ الميلادي</p>
          <p className="text-slate-200 text-sm font-bold">{gregorianDisplay}</p>
        </div>

        {/* Days Until Next Event */}
        {nextEvent && (
          <div className="bg-indigo-800/40 border border-indigo-600/50 rounded-2xl p-4 mb-6">
            <p className="text-[10px] text-indigo-300 font-black uppercase mb-2">⏰ المناسبة القادمة</p>
            <p className="text-amber-300 font-black text-lg">{nextEvent.name}</p>
            <p className="text-slate-300 text-[10px] mt-2">{nextEvent.hijriMonth}/{nextEvent.hijriDay}</p>
          </div>
        )}

        {/* Calendar Grid */}
        <div className="bg-indigo-800/30 rounded-xl p-4 mb-6">
          <p className="text-[10px] text-indigo-300 font-black uppercase mb-3">شهر {arabicMonthName}</p>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: daysInMonths[hijriInfo.month - 1] }, (_, i) => {
              const day = i + 1;
              const isToday = day === hijriInfo.day;
              const hasEvent = ISLAMIC_CALENDAR_EVENTS.some(e => 
                e.hijriMonth === hijriInfo.month && e.hijriDay === day
              );
              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex items-center justify-center font-black text-xs ${
                    isToday
                      ? 'bg-amber-500 text-indigo-950 border-2 border-amber-300 scale-105'
                      : hasEvent
                      ? 'bg-indigo-600 text-white border border-indigo-500'
                      : 'bg-indigo-700/40 text-slate-300 border border-indigo-600/30'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dual Calendar Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-indigo-800/40 rounded-xl p-3 border border-indigo-600/30 text-center">
            <p className="text-[8px] text-indigo-300 font-black uppercase mb-1">المتبقي من الشهر</p>
            <p className="text-amber-400 font-black text-2xl">{daysInMonths[hijriInfo.month - 1] - hijriInfo.day}</p>
          </div>
          <div className="bg-indigo-800/40 rounded-xl p-3 border border-indigo-600/30 text-center">
            <p className="text-[8px] text-indigo-300 font-black uppercase mb-1">أيام السنة</p>
            <p className="text-amber-400 font-black text-2xl">{hijriInfo.year}</p>
          </div>
        </div>
      </div>

      {/* Islamic Events */}
      <div className="mx-2 space-y-4">
        <h3 className="text-xl font-black text-amber-400 px-4">🌙 المناسبات الإسلامية</h3>
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 px-2 no-scrollbar">
          {['جميعاً', 'أعياد', 'مناسبات', 'تاريخي'].map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedEventTab(idx)}
              className={`px-4 py-2 rounded-full font-black text-xs whitespace-nowrap transition-all ${
                selectedEventTab === idx
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="px-2 space-y-3">
          {ISLAMIC_CALENDAR_EVENTS.filter(event => {
            if (selectedEventTab === 0) return true;
            if (selectedEventTab === 1) return event.type === 'holiday';
            if (selectedEventTab === 2) return event.type === 'observance';
            return event.type === 'historical';
          }).map((event, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${getColorClasses(event.type)} rounded-2xl p-5 border-b-4 shadow-lg`}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <p className="text-amber-300 font-black text-lg mb-1">{event.name}</p>
                  <p className="text-amber-200 text-[10px] font-bold">
                    {event.hijriMonth}/{event.hijriDay}
                  </p>
                </div>
                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[10px] font-black whitespace-nowrap">
                  {getTypeLabel(event.type)}
                </span>
              </div>

              {/* Description */}
              <p className="text-slate-100 text-[10px] font-bold leading-relaxed mb-4 bg-white/5 p-3 rounded-lg">
                {event.description}
              </p>

              {/* Significance */}
              <p className="text-amber-100 text-[9px] mb-4 flex gap-2">
                <span className="font-black">⭐</span>
                <span>{event.significance}</span>
              </p>

              {/* Note Section */}
              <div className="bg-white/10 rounded-lg p-3 space-y-2">
                {eventNotes[event.name] ? (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">📝</span>
                      <p className="text-slate-100 text-[10px] flex-1">{eventNotes[event.name]}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowNoteForm(event.name);
                          setNoteInput(eventNotes[event.name]);
                        }}
                        className="flex-1 px-2 py-1 bg-blue-600/50 hover:bg-blue-600 text-white text-[9px] font-bold rounded active:scale-95 transition-all"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => deleteNote(event.name)}
                        className="flex-1 px-2 py-1 bg-red-600/50 hover:bg-red-600 text-white text-[9px] font-bold rounded active:scale-95 transition-all"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowNoteForm(event.name);
                      setNoteInput('');
                    }}
                    className="w-full py-2 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-400/30 hover:border-slate-400/60 rounded transition-all"
                  >
                    + أضف ملاحظة
                  </button>
                )}
              </div>

              {/* Note Form */}
              {showNoteForm === event.name && (
                <div className="mt-3 space-y-2 bg-white/5 p-3 rounded-lg border border-white/10">
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="أضف ملاحظتك هنا..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-[10px] font-bold placeholder-slate-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => addOrUpdateNote(event.name)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded active:scale-95 transition-all"
                    >
                      ✓ حفظ
                    </button>
                    <button
                      onClick={() => setShowNoteForm(null)}
                      className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-black rounded active:scale-95 transition-all"
                    >
                      ✕ إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Islamic Calendar Info */}
      <div className="mx-2 bg-slate-800/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-amber-400 font-black">📖 معلومات التقويم الهجري</h3>
        <div className="space-y-3 text-[10px] text-slate-300 leading-relaxed">
          <p>
            <span className="text-amber-400 font-black">🌙 الأساس:</span> {' '}
            التقويم الهجري يعتمد على دورة القمر، حيث كل سنة هجرية = 354 أو 355 يوماً، وهو أقصر من السنة الميلادية بحوالي 11 يوماً.
          </p>
          <p>
            <span className="text-amber-400 font-black">⭐ البداية:</span> {' '}
            بدأ التقويم الهجري من هجرة النبي محمد ﷺ من مكة إلى المدينة في سنة 1 هـ.
          </p>
          <p>
            <span className="text-amber-400 font-black">📆 الأشهر:</span> {' '}
            12 شهراً هجرياً: محرم، صفر، ربيع الأول، ربيع الثاني، جمادى الأولى، جمادى الثانية، رجب، شعبان، رمضان، شوال، ذو القعدة، ذو الحجة.
          </p>
          <p>
            <span className="text-amber-400 font-black">✨ الأهمية:</span> {' '}
            يستخدم في تحديد المناسبات الإسلامية كرمضان والأعياد والحج، ويعتبر التقويم الرسمي في الدول الإسلامية.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HijriCalendar;
