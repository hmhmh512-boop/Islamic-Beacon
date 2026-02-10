
import React, { useState, useEffect } from 'react';

const ZakatCalculator: React.FC = () => {
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
    <div className="space-y-6 animate-slide pb-20">
      <div className="bg-emerald-950 p-8 rounded-[2.5rem] text-white shadow-2xl border-b-8 border-amber-600 relative overflow-hidden mx-2">
        <h3 className="text-3xl font-black quran-text text-amber-400 mb-2">حاسبة الزكاة الشرعية</h3>
        <p className="text-xs opacity-80 leading-relaxed font-bold">
          "خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا"
        </p>
        <span className="absolute top-4 left-4 text-6xl opacity-10">💰</span>
        <p className="text-[9px] mt-4 opacity-80">
          تعتمد هذه الحاسبة على نصاب الذهب البالغ خمسة وثمانين جراماً من الذهب الخالص بنسبة اثنين ونصف في المائة من إجمالي المال المستحق للزكاة، وهي أداة مساعدة لا تغني عن سؤال أهل العلم في الحالات الخاصة.
        </p>
      </div>

      <div className="mx-2 space-y-5 bg-slate-900/50 p-6 rounded-[2rem] border border-amber-500/20">
        {/* قسم سعر الذهب */}
        <div className="space-y-2">
          <label className="text-xs font-black text-amber-500 uppercase flex justify-between">
            <span>سعر جرام الذهب (عيار 24) اليوم</span>
            <button onClick={() => setIsManualPrice(!isManualPrice)} className="text-blue-400 underline">
              {isManualPrice ? 'استخدام السعر التلقائي' : 'تعديل يدوياً'}
            </button>
          </label>
          <div className="relative">
            <input 
              type="number" 
              value={goldPrice} 
              onChange={(e) => setGoldPrice(parseFloat(e.target.value))}
              disabled={!isManualPrice}
              className={`w-full p-4 rounded-xl bg-slate-800 text-white font-black text-xl border-2 outline-none transition-colors ${isManualPrice ? 'border-amber-500' : 'border-slate-700 opacity-80'}`}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">جنية/جرام</span>
          </div>
          <p className="text-[9px] text-slate-400 text-right">
            تأكد من إدخال سعر جرام الذهب عيار 24 في بلدك لضمان دقة النصاب، ويمكنك العمل بالسعر الافتراضي عند عدم توفر اتصال بالإنترنت.
          </p>
          {loadingPrice && (
            <p className="text-[9px] text-emerald-300 text-right font-bold">
              يجري محاولة تحديث السعر من خدمة خارجية، ويمكنك دائماً الاعتماد على الإدخال اليدوي متى شئت.
            </p>
          )}
        </div>

        {/* المدخرات النقدية */}
        <div className="space-y-2">
          <label className="text-xs font-black text-white uppercase">إجمالي السيولة النقدية (ومدخرات البنك)</label>
          <input 
            type="number" 
            value={cash} 
            onChange={(e) => setCash(e.target.value)}
            placeholder="مثلاً: 100000"
            className="w-full p-4 rounded-xl bg-slate-800 text-white font-black text-xl border-2 border-slate-700 focus:border-emerald-500 outline-none"
          />
        </div>

        {/* مدخرات الذهب */}
        <div className="space-y-2">
          <label className="text-xs font-black text-white uppercase">وزن الذهب المدخر (جرام)</label>
          <input 
            type="number" 
            value={goldWeight} 
            onChange={(e) => setGoldWeight(e.target.value)}
            placeholder="مثلاً: 50"
            className="w-full p-4 rounded-xl bg-slate-800 text-white font-black text-xl border-2 border-slate-700 focus:border-emerald-500 outline-none"
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
          <div className={`p-8 rounded-[2.5rem] text-center border-4 shadow-2xl ${result > 0 ? 'bg-emerald-900 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}>
            <p className="text-xs font-black text-white/70 uppercase mb-2">
              {result > 0 ? 'قيمة الزكاة الواجب إخراجها' : 'حالة النصاب'}
            </p>
            
            {result > 0 ? (
              <>
                <div className="text-5xl font-black text-white glow-gold mb-2">{result.toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-lg">عملة</span></div>
                <p className="text-[10px] text-emerald-300 font-bold">
                  (النصاب هو {(85 * goldPrice).toLocaleString()}، ومالك تجاوز النصاب)
                </p>
                <p className="text-[9px] text-emerald-100 font-bold mt-3 leading-relaxed">
                  إذا بلغ مالك النصاب وحال عليه الحول القمري الكامل وجب عليك إخراج الزكاة فوراً وعدم تأخيرها إلا لعذر، وتصرف للفقراء والمستحقين المذكورين في آية مصارف الزكاة، ويمكنك تقسيم المبلغ على أكثر من دفعة خلال مدة قصيرة ما دام في نفس العام.
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-black text-slate-300 mb-2">لا زكاة عليك</div>
                <p className="text-xs text-slate-400 font-bold leading-relaxed">
                  إجمالي مالك لم يبلغ النصاب الشرعي ({ (85 * goldPrice).toLocaleString() } عملة).<br/>
                  النصاب هو قيمة 85 جرام ذهب عيار 24.
                </p>
                <p className="text-[9px] text-slate-300 font-bold mt-3 leading-relaxed">
                  مع عدم وجوب الزكاة عليك الآن إلا أن الحرص على الادخار بنية بلوغ النصاب وإخراج الزكاة من علامات توفيق الله للعبد، وأكثر من الصدقة التطوعية قدر استطاعتك.
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
