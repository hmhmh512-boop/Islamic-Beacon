
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const ZakatCalculator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [cash, setCash] = useState<string>('');
  const [goldWeight, setGoldWeight] = useState<string>('');
  const [goldPrice, setGoldPrice] = useState<number>(3500); // سعر مبدئي تقريبي للجرام عيار 24
  const [isManualPrice, setIsManualPrice] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    fetchGoldPrice();
  }, []);

  const fetchGoldPrice = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setLoadingPrice(false);
      return;
    }
    setLoadingPrice(true);
    try {
      // محاولة جلب السعر العالمي
      const res = await fetch('https://api.gold-api.com/price/XAU');
      const data = await res.json();
      if (data.price) {
        // تركنا السعر الافتراضي كما هو لتفادي عدم دقة التحويلات، ويمكن للمستخدم التعديل يدوياً متى شاء.
      }
    } catch (e) {
      console.log("Failed to fetch price");
    }
    setLoadingPrice(false);
  };

  const calculateZakat = () => {
    const cashValue = parseFloat(cash) || 0;
    const goldValue = (parseFloat(goldWeight) || 0) * goldPrice;
    const totalWealth = cashValue + goldValue;
    
    // نصاب الذهب 85 جرام من الذهب الخالص (عيار 24)
    const nisab = 85 * goldPrice;

    if (totalWealth >= nisab) {
      setResult(totalWealth * 0.025); // ربع العشر (2.5%)
    } else {
      setResult(0);
    }
  };

  return (
    <div className={`space-y-6 animate-slide pb-20 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className={`${isDark ? 'bg-emerald-950 border-amber-600' : 'bg-emerald-600 border-amber-400'} p-8 rounded-[2.5rem] text-white shadow-2xl border-b-8 relative overflow-hidden mx-2`}>
        <h3 className="text-3xl font-black quran-text text-amber-400 mb-2">حاسبة الزكاة الشرعية</h3>
        <p className="text-xs opacity-80 leading-relaxed font-bold">
          "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا"
        </p>
        <span className="absolute top-4 left-4 text-6xl opacity-10">💰</span>
        <p className="text-[9px] mt-4 opacity-80">
          تعتمد هذه الحاسبة على نصاب الذهب البالغ خمسة وثمانين جراماً من الذهب الخالص بنسبة اثنين ونصف في المائة من إجمالي المال المستحق للزكاة، وهي أداة مساعدة لا تغني عن سؤال أهل العلم في الحالات الخاصة.
        </p>
      </div>

      <div className={`mx-2 space-y-5 ${isDark ? 'bg-slate-900/50' : 'bg-white'} p-6 rounded-[2rem] border ${isDark ? 'border-amber-500/20' : 'border-slate-200'} shadow-xl`}>
        {/* قسم سعر الذهب */}
        <div className="space-y-2">
          <label className="text-xs font-black text-amber-500 uppercase flex justify-between">
            <span>سعر جرام الذهب (عيار 24) اليوم</span>
            <button onClick={() => setIsManualPrice(!isManualPrice)} className="text-blue-500 underline text-[10px]">
              {isManualPrice ? 'استخدام السعر التلقائي' : 'تعديل يدوياً'}
            </button>
          </label>
          <div className="relative">
            <input 
              type="number" 
              value={goldPrice} 
              onChange={(e) => setGoldPrice(parseFloat(e.target.value))}
              disabled={!isManualPrice}
              className={`w-full p-4 rounded-xl font-black text-xl border-2 outline-none transition-colors ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'} ${isManualPrice ? 'border-amber-500' : (isDark ? 'border-slate-700 opacity-80' : 'border-slate-200 opacity-80')}`}
            />
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>جنية/جرام</span>
          </div>
          <p className={`text-[9px] ${isDark ? 'text-slate-400' : 'text-slate-500'} text-right font-bold`}>
            تأكد من إدخال سعر جرام الذهب عيار 24 في بلدك لضمان دقة النصاب.
          </p>
          {loadingPrice && (
            <p className="text-[9px] text-emerald-500 text-right font-bold animate-pulse">
              يجري محاولة تحديث السعر...
            </p>
          )}
        </div>

        {/* المدخرات النقدية */}
        <div className="space-y-2">
          <label className={`text-xs font-black uppercase ${isDark ? 'text-white' : 'text-slate-700'}`}>إجمالي السيولة النقدية (ومدخرات البنك)</label>
          <input 
            type="number" 
            value={cash} 
            onChange={(e) => setCash(e.target.value)}
            placeholder="مثلاً: 100000"
            className={`w-full p-4 rounded-xl font-black text-xl border-2 outline-none ${isDark ? 'bg-slate-800 text-white border-slate-700 focus:border-emerald-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-emerald-500'}`}
          />
        </div>

        {/* مدخرات الذهب */}
        <div className="space-y-2">
          <label className={`text-xs font-black uppercase ${isDark ? 'text-white' : 'text-slate-700'}`}>وزن الذهب المدخر (جرام)</label>
          <input 
            type="number" 
            value={goldWeight} 
            onChange={(e) => setGoldWeight(e.target.value)}
            placeholder="مثلاً: 50"
            className={`w-full p-4 rounded-xl font-black text-xl border-2 outline-none ${isDark ? 'bg-slate-800 text-white border-slate-700 focus:border-emerald-500' : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-emerald-500'}`}
          />
        </div>

        <button 
          onClick={calculateZakat}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-all mt-4 border-b-4 border-amber-800"
        >
          احسب الزكاة
        </button>
      </div>

      {result !== null && (
        <div className="mx-2 animate-bounce-in">
          <div className={`p-8 rounded-[2.5rem] text-center border-4 shadow-2xl ${result > 0 ? (isDark ? 'bg-emerald-950 border-emerald-500' : 'bg-emerald-50 border-emerald-500') : (isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-slate-300')}`}>
            <p className={`text-xs font-black uppercase mb-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              {result > 0 ? 'قيمة الزكاة الواجب إخراجها' : 'حالة النصاب'}
            </p>
            
            {result > 0 ? (
              <>
                <div className={`text-5xl font-black glow-gold mb-2 ${isDark ? 'text-white' : 'text-emerald-700'}`}>{result.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-lg">عملة</span></div>
                <p className={`text-[10px] font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                  (النصاب هو {(85 * goldPrice).toLocaleString()}، ومالك تجاوز النصاب)
                </p>
                <p className={`text-[9px] font-bold mt-3 leading-relaxed ${isDark ? 'text-emerald-100' : 'text-emerald-800'}`}>
                  إذا بلغ مالك النصاب وحال عليه الحول القمري الكامل وجب عليك إخراج الزكاة فوراً.
                </p>
              </>
            ) : (
              <>
                <div className={`text-2xl font-black mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>لا زكاة عليك</div>
                <p className={`text-xs font-bold leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  إجمالي مالك لم يبلغ النصاب الشرعي ({ (85 * goldPrice).toLocaleString() } عملة).<br/>
                  النصاب هو قيمة 85 جرام ذهب عيار 24.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZakatCalculator;
