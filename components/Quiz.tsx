
import React, { useState, useEffect } from 'react';
import { QUIZ_POOL } from '../constants';
import { QuizQuestion } from '../types';
import { generateSmartQuiz } from '../geminiService';
import { WORSHIP_QUIZZES, WorshipQuiz } from '../daily-missions';

const Quiz: React.FC = () => {
  const [mode, setMode] = useState<'selection' | 'playing' | 'worship'>('selection');
  const [quizType, setQuizType] = useState<'classic' | 'ai' | 'worship'>('classic');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [worshipQuestions, setWorshipQuestions] = useState<WorshipQuiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const startClassicQuiz = () => {
    setLoading(true);
    const shuffled = [...QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 10);
    setQuestions(shuffled);
    resetGameState();
    setQuizType('classic');
    setMode('playing');
    setLoading(false);
  };

  const startWorshipQuiz = () => {
    setLoading(true);
    const shuffled = [...WORSHIP_QUIZZES].sort(() => 0.5 - Math.random()).slice(0, 10);
    setWorshipQuestions(shuffled);
    resetGameState();
    setQuizType('worship');
    setMode('worship');
    setLoading(false);
  };

  const startAIQuiz = async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      alert('أنت حالياً في وضع عدم الاتصال، سيتم تشغيل تحدي بنك الأسئلة المحلي حتى تعود الشبكة.');
      startClassicQuiz();
      return;
    }

    setLoading(true);
    try {
      const aiQuestions = await generateSmartQuiz();
      if (aiQuestions && aiQuestions.length > 0) {
        setQuestions(aiQuestions);
        resetGameState();
        setQuizType('ai');
        setMode('playing');
      } else {
        throw new Error("Empty AI response");
      }
    } catch (e) {
      alert("الذكاء الاصطناعي مشغول حالياً، سنبدأ التحدي الكلاسيكي لضمان وقتك.");
      startClassicQuiz();
    } finally {
      setLoading(false);
    }
  };

  const resetGameState = () => {
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setSelectedOption(null);
    setShowExplanation(false);
    setFinished(false);
  };

  const handleAnswer = (idx: number) => {
    if (showExplanation || lives <= 0 || selectedOption !== null) return;
    
    setSelectedOption(idx);
    setShowExplanation(true);
    
    if (idx === questions[currentIndex].answerIndex) {
      setScore(score + 10);
      if (window.navigator?.vibrate) window.navigator.vibrate(50);
    } else {
      setLives(lives - 1);
      if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100]);
    }
  };

  const handleWorshipAnswer = (idx: number) => {
    if (showExplanation || lives <= 0 || selectedOption !== null) return;
    
    setSelectedOption(idx);
    setShowExplanation(true);
    
    const q = worshipQuestions[currentIndex];
    const points = q.points || 10;
    
    if (idx === q.answerIndex) {
      setScore(score + points);
      if (window.navigator?.vibrate) window.navigator.vibrate(50);
    } else {
      setLives(lives - 1);
      if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100]);
    }
  };

  const nextQuestion = () => {
    if (quizType === 'worship') {
      if (currentIndex < worshipQuestions.length - 1 && lives > 0) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        setFinished(true);
      }
    } else {
      if (currentIndex < questions.length - 1 && lives > 0) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        setFinished(true);
      }
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6">
      <div className="w-20 h-20 border-8 border-amber-500 border-t-transparent rounded-full animate-spin shadow-2xl"></div>
      <p className="text-amber-500 font-black text-2xl quran-text animate-pulse">يستحضر رفيقك الأسئلة...</p>
    </div>
  );

  if (mode === 'selection') {
    return (
      <div className="animate-fade-in space-y-8 pb-24 px-2">
        <div className="theme-gradient-header p-12 rounded-[3rem] text-center text-white border-b-8 border-amber-600 shadow-2xl relative overflow-hidden">
          <h2 className="text-4xl font-black quran-text text-amber-400 glow-gold mb-4">المسابقات الملكية</h2>
          <p className="text-xs font-bold opacity-70 tracking-widest uppercase">ميدان العلم والمعرفة</p>
          <span className="absolute -bottom-4 -left-4 text-9xl opacity-10">🏆</span>
        </div>

        <div className="grid gap-6">
          <button 
            onClick={startAIQuiz}
            className="bg-slate-900 p-8 rounded-[2.5rem] border-2 border-amber-500/30 flex flex-col items-center gap-4 transition-all active:scale-95 shadow-xl hover:border-amber-400"
          >
            <span className="text-5xl">⚡</span>
            <div className="text-center">
              <h4 className="text-xl font-black text-amber-400">تحدي الذكاء السريع</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">أسئلة متجددة بذكاء Gemini (5 أسئلة)</p>
            </div>
          </button>

          <button 
            onClick={startClassicQuiz}
            className="bg-emerald-950 p-8 rounded-[2.5rem] border-2 border-emerald-500/30 flex flex-col items-center gap-4 transition-all active:scale-95 shadow-xl hover:border-emerald-400"
          >
            <span className="text-5xl">🏛️</span>
            <div className="text-center">
              <h4 className="text-xl font-black text-emerald-400">تحدي التراث الكلاسيكي</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">من بنك الأسئلة المعتمد (10 أسئلة)</p>
            </div>
          </button>

          <button 
            onClick={startWorshipQuiz}
            className="bg-rose-950 p-8 rounded-[2.5rem] border-2 border-rose-500/30 flex flex-col items-center gap-4 transition-all active:scale-95 shadow-xl hover:border-rose-400"
          >
            <span className="text-5xl">🕌</span>
            <div className="text-center">
              <h4 className="text-xl font-black text-rose-400">مسابقات العبادة</h4>
              <p className="text-[10px] text-slate-400 font-bold mt-1">أسئلة عن الصلاة والصيام والعبادات (10 أسئلة)</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (finished || lives <= 0) {
    const isWin = quizType === 'worship' 
      ? score >= (worshipQuestions.length * 5)
      : score >= (questions.length * 5);
    
    return (
      <div className="bg-slate-900 rounded-[3.5rem] p-12 shadow-2xl text-center flex flex-col items-center animate-bounce-in border-t-8 border-amber-500 border-b-8 mx-2 mt-10">
        <div className="text-8xl mb-6">{isWin ? '🎖️' : '🕯️'}</div>
        <h2 className="text-4xl font-black text-amber-500 mb-2 quran-text">{isWin ? 'إنجاز ملكي!' : 'حاول مجدداً'}</h2>
        <p className="text-white mb-8 font-black text-2xl">لقد حصلت على <span className="text-amber-400 text-4xl">{score}</span> نقطة</p>
        
        <button 
          onClick={() => setMode('selection')}
          className="bg-amber-600 text-white w-full py-6 rounded-[2.5rem] font-black shadow-xl hover:bg-amber-700 transition-all text-xl border-b-4 border-amber-900"
        >
          العودة للميدان
        </button>
      </div>
    );
  }

  // Worship Quiz Display
  if (mode === 'worship' && worshipQuestions.length > 0) {
    const q = worshipQuestions[currentIndex];
    if (!q) return null;

    return (
      <div className="space-y-8 animate-fade-in pb-32 px-2">
        <div className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-rose-500">س {currentIndex + 1} / {worshipQuestions.length}</span>
            <div className="flex gap-1.5">
              {[...Array(3)].map((_, i) => (
                <span key={i} className={`text-xl transition-all duration-700 ${i < lives ? 'opacity-100 scale-110' : 'opacity-10 grayscale scale-90'}`}>❤️</span>
              ))}
            </div>
          </div>
          <span className="text-[10px] font-black text-white bg-rose-700/40 px-4 py-2 rounded-xl border border-rose-500/30">النقاط: {score}</span>
        </div>

        <div className="bg-rose-950/90 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-[8px] border-rose-600 border-r-2 border-l-2 border-white/5">
          <h3 className="text-2xl font-black leading-relaxed text-right quran-text">
            {q.question}
          </h3>
          <div className="mt-4 flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-1 rounded ${
              q.difficulty === 'easy' ? 'bg-green-900 text-green-200' :
              q.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-200' :
              'bg-red-900 text-red-200'
            }`}>
              {q.difficulty === 'easy' ? '⭐ سهل' : q.difficulty === 'medium' ? '⭐⭐ متوسط' : '⭐⭐⭐ صعب'}
            </span>
            <span className="text-slate-300 font-bold text-[9px]">النقاط: +{q.points}</span>
          </div>
          <span className="absolute top-2 right-2 text-5xl opacity-5">📿</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {q.options && q.options.length > 0 ? q.options.map((opt, idx) => {
            let styles = "bg-slate-800 border-2 border-white/5 text-slate-100";
            if (showExplanation) {
              if (idx === q.answerIndex) styles = "bg-emerald-800 border-emerald-400 text-white scale-[1.02] shadow-[0_0_25px_rgba(16,185,129,0.3)]";
              else if (idx === selectedOption) styles = "bg-red-900/60 border-red-500 text-red-200 opacity-80 scale-95";
              else styles = "bg-slate-900/40 border-transparent opacity-30";
            } else {
              styles += " active:scale-95 shadow-lg hover:border-rose-500/50 hover:bg-slate-700";
            }

            return (
              <button
                key={idx}
                disabled={showExplanation}
                onClick={() => handleWorshipAnswer(idx)}
                className={`p-6 rounded-[2rem] text-right font-black transition-all text-lg flex items-center gap-5 ${styles}`}
              >
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] shrink-0 ${showExplanation && idx === q.answerIndex ? 'bg-white text-emerald-800' : 'bg-black/30 text-rose-500 font-mono'}`}>
                  {idx + 1}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            );
          }) : (
            <div className="text-center text-white p-10 bg-red-900/20 rounded-2xl">
              عذراً، تعذر تحميل الخيارات لهذا السؤال.
            </div>
          )}
        </div>

        {showExplanation && (
          <div className="bg-amber-950/30 border-r-[12px] border-rose-600 p-8 rounded-[2rem] shadow-2xl animate-slide border border-rose-900/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📜</span>
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">التوضيح والفائدة</span>
            </div>
            <p className="text-md text-slate-100 font-bold leading-relaxed quran-text mb-4">{q.explanation}</p>
            
            {q.relatedVerse && (
              <div className="bg-amber-900/30 border-l-4 border-amber-500 p-3 rounded mb-3">
                <p className="text-[9px] text-amber-300 font-bold">📖 <strong>الآية:</strong> {q.relatedVerse}</p>
              </div>
            )}
            
            {q.relatedHadith && (
              <div className="bg-green-900/30 border-l-4 border-green-500 p-3 rounded mb-3">
                <p className="text-[9px] text-green-300 font-bold">🕌 <strong>الحديث:</strong> {q.relatedHadith}</p>
              </div>
            )}

            <button 
              onClick={nextQuestion}
              className="mt-6 w-full bg-emerald-700 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-emerald-600 transition-all border-b-6 border-emerald-900 active:scale-95"
            >
              {currentIndex === worshipQuestions.length - 1 || lives <= 0 ? 'رؤية ميزان الدرجات' : 'السؤال التالي ⮕'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Classic Quiz Display
  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-32 px-2">
      <div className="flex justify-between items-center bg-black/20 p-5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-amber-500">س {currentIndex + 1} / {questions.length}</span>
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-xl transition-all duration-700 ${i < lives ? 'opacity-100 scale-110' : 'opacity-10 grayscale scale-90'}`}>❤️</span>
            ))}
          </div>
        </div>
        <span className="text-[10px] font-black text-white bg-amber-700/40 px-4 py-2 rounded-xl border border-amber-500/30">النقاط: {score}</span>
      </div>

      <div className="bg-emerald-950/90 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-[8px] border-amber-600 border-r-2 border-l-2 border-white/5">
        <h3 className="text-2xl font-black leading-relaxed text-right quran-text">
          {q.question}
        </h3>
        <span className="absolute top-2 right-2 text-5xl opacity-5">☪️</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {q.options && q.options.length > 0 ? q.options.map((opt, idx) => {
          let styles = "bg-slate-800 border-2 border-white/5 text-slate-100";
          if (showExplanation) {
            if (idx === q.answerIndex) styles = "bg-emerald-800 border-emerald-400 text-white scale-[1.02] shadow-[0_0_25px_rgba(16,185,129,0.3)]";
            else if (idx === selectedOption) styles = "bg-red-900/60 border-red-500 text-red-200 opacity-80 scale-95";
            else styles = "bg-slate-900/40 border-transparent opacity-30";
          } else {
            styles += " active:scale-95 shadow-lg hover:border-amber-500/50 hover:bg-slate-700";
          }

          return (
            <button
              key={idx}
              disabled={showExplanation}
              onClick={() => handleAnswer(idx)}
              className={`p-6 rounded-[2rem] text-right font-black transition-all text-lg flex items-center gap-5 ${styles}`}
            >
              <span className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] shrink-0 ${showExplanation && idx === q.answerIndex ? 'bg-white text-emerald-800' : 'bg-black/30 text-amber-500 font-mono'}`}>
                {idx + 1}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        }) : (
          <div className="text-center text-white p-10 bg-red-900/20 rounded-2xl">
            عذراً، تعذر تحميل الخيارات لهذا السؤال.
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="bg-amber-950/30 border-r-[12px] border-amber-600 p-8 rounded-[2rem] shadow-2xl animate-slide border border-amber-900/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📜</span>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">التوضيح والفائدة</span>
          </div>
          <p className="text-md text-slate-100 font-bold leading-relaxed quran-text">{q.explanation}</p>
          <button 
            onClick={nextQuestion}
            className="mt-10 w-full bg-emerald-700 text-white py-6 rounded-[2rem] font-black shadow-2xl hover:bg-emerald-600 transition-all border-b-6 border-emerald-900 active:scale-95"
          >
            {currentIndex === questions.length - 1 || lives <= 0 ? 'رؤية ميزان الدرجات' : 'السؤال التالي ⮕'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
