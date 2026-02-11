
import React, { useState, useRef, useEffect } from 'react';
import { askReligiousAssistant, speakText, stopSpeech, AssistantResponse } from '../geminiService';
import { useTheme } from '../context/ThemeContext';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
  source?: 'online' | 'offline' | 'hybrid';
  suggestedTopics?: string[];
  canReadAloud?: boolean;
}

const Assistant: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      parts: [{ 
        text: 'مرحباً بك في رحاب العلم. أنا رفيقك "نور الهدى"، اسألني ما شئت عن الفقه، السيرة، الأذكار، القرآن الكريم، أو أحكام الدين، وسأجيبك بدقة مستمداً علمي من الكتاب والسنة المطهرة. يمكنني الإجابة حتى بدون اتصال بالإنترنت!' 
      }],
      source: 'offline'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickQuestions: string[] = [
    'أريد شرحاً مبسطاً للتوحيد وأقسامه مع مثال من القرآن.',
    'كيف أتوب توبة نصوحاً من الذنوب المتكررة مع أدعية ثابتة؟',
    'ما هو فضل أذكار الصباح والمساء مع ذكر بعض النصوص؟',
    'أشعر بالهم والحزن، ما هي الأدعية والأذكار التي تنصح بها؟',
    'كيف أزكي مالي إذا كان عندي مال نقدي وذهب؟ اذكر مثالاً رقمياً مبسطاً.'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg];
      const res = await askReligiousAssistant(input, history);
      
      const modelMsg: Message = { 
        role: 'model', 
        parts: [{ text: res.answer }],
        source: res.source,
        suggestedTopics: res.suggestedTopics,
        canReadAloud: res.canReadAloud
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const fallbackMsg: Message = {
        role: 'model',
        parts: [{
          text: 'حدث عطل غير متوقع أثناء معالجة السؤال، ولكن لا تقلق، يمكنك إعادة المحاولة أو صياغة سؤالك من جديد، وسيبقى محفوظاً في سجل المحادثة داخل جهازك.'
        }],
        source: 'offline'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (index: number, text: string) => {
    if (isSpeaking && speakingMessageIndex === index) {
      stopSpeech();
      setIsSpeaking(false);
      setSpeakingMessageIndex(null);
    } else {
      setSpeakingMessageIndex(index);
      setIsSpeaking(true);
      try {
        await speakText(text);
        setIsSpeaking(false);
        setSpeakingMessageIndex(null);
      } catch (error) {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setSpeakingMessageIndex(null);
      }
    }
  };

  const handleSuggestedTopic = (topic: string) => {
    setInput(topic);
  };

  return (
    <div className={`animate-fade-in h-[78vh] flex flex-col pb-20 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className={`flex-1 ${isDark ? 'bg-slate-900/50 border-amber-500/20' : 'bg-white border-slate-200'} rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border`}>
        <div className={`${isDark ? 'theme-gradient-header' : 'bg-emerald-600'} p-6 text-white flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl border-2 border-white/20 animate-pulse">🕋</div>
            <div>
              <h4 className="text-lg font-black quran-text text-amber-400 glow-gold">الرفيق الفقهي</h4>
              <p className="text-[8px] opacity-70 font-bold uppercase tracking-widest">
                {isOnline ? '🟢 متصل - إجابات ذكية ومحسّنة' : '🔴 بلا إنترنت - إجابات محلية موثوقة'}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-2 border ${
            isOnline ? 'bg-emerald-600/90 border-emerald-300 text-white' : 'bg-amber-900/80 border-amber-400 text-amber-50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-300 animate-pulse' : 'bg-amber-300'}`}></span>
            <span>{isOnline ? 'متصل بالإنترنت' : 'وضع محلي'}</span>
          </div>
        </div>

        <div className={`px-6 pt-3 pb-1 ${isDark ? 'bg-slate-950/60' : 'bg-slate-50'} border-b ${isDark ? 'border-amber-500/10' : 'border-slate-200'}`}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setInput(q)}
                className={`px-4 py-2 rounded-2xl text-[9px] font-black transition-all whitespace-nowrap border ${
                  isDark ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-500 hover:bg-slate-700' : 'bg-white text-slate-600 border-slate-200 hover:border-amber-500 hover:bg-slate-50'
                }`}
              >
                {q.substring(0, 20)}...
              </button>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className={`flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar ${isDark ? 'bg-slate-950/80' : 'bg-slate-100'}`}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'} gap-3`}>
              <div className={`max-w-[90%] p-6 rounded-3xl text-lg font-bold shadow-xl leading-relaxed whitespace-pre-wrap ${
                m.role === 'user' 
                  ? (isDark ? 'bg-red-900 text-white border-amber-500' : 'bg-red-600 text-white border-amber-300') + ' rounded-tl-none border-l-4' 
                  : (isDark ? 'bg-slate-800 text-slate-100 border-emerald-600' : 'bg-white text-slate-800 border-emerald-500') + ' rounded-tr-none border-r-4'
              }`}>
                <div className="mb-3">{m.parts[0].text}</div>
                
                {/* Source badge and read-aloud button */}
                {m.role === 'model' && (
                  <div className={`flex flex-wrap gap-2 items-center text-[10px] mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    {m.source && (
                      <span className={`px-2 py-1 rounded-full font-black ${
                        m.source === 'offline' ? (isDark ? 'bg-amber-900/40 text-amber-200' : 'bg-amber-100 text-amber-700') :
                        m.source === 'online' ? (isDark ? 'bg-emerald-900/40 text-emerald-200' : 'bg-emerald-100 text-emerald-700') :
                        (isDark ? 'bg-blue-900/40 text-blue-200' : 'bg-blue-100 text-blue-700')
                      }`}>
                        {m.source === 'offline' ? '📱 محلي' : m.source === 'online' ? '🌐 أونلاين' : '🔄 هجين'}
                      </span>
                    )}
                    {m.canReadAloud && (
                      <button
                        onClick={() => handleSpeak(i, m.parts[0].text)}
                        className={`px-3 py-1 rounded-full font-black transition-all ${
                          isSpeaking && speakingMessageIndex === i
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-amber-600/40 text-amber-200 hover:bg-amber-600/60'
                        }`}
                      >
                        {isSpeaking && speakingMessageIndex === i ? '⏹️ إيقاف' : '🔊 استماع'}
                      </button>
                    )}
                  </div>
                )}

                {/* Suggested topics */}
                {m.suggestedTopics && m.suggestedTopics.length > 0 && (
                  <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-black mb-2`}>💡 مواضيع ذات صلة:</p>
                    <div className="flex flex-wrap gap-2">
                      {m.suggestedTopics.map((topic, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedTopic(topic)}
                          className={`px-3 py-1 rounded-2xl text-[9px] font-black border transition-all ${
                            isDark ? 'bg-emerald-900/50 text-emerald-200 border-emerald-600/30 hover:border-emerald-500' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className={`px-6 py-4 rounded-full flex items-center gap-3 border animate-pulse ${isDark ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                <span className={`text-[10px] font-black ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>🔄 يستحضر المساعد الرد...</span>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 ${isDark ? 'bg-emerald-400' : 'bg-emerald-500'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`p-6 ${isDark ? 'bg-slate-900 border-amber-500/10' : 'bg-white border-slate-200'} border-t flex gap-3 items-center`}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل رفيقك..."
            className={`flex-1 px-6 py-4 rounded-2xl text-md font-bold outline-none transition-all border-2 ${
              isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500 focus:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:bg-white'
            }`}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="w-14 h-14 bg-amber-600 text-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl active:scale-90 transition-all hover:bg-amber-700 disabled:opacity-50"
          >
            ✈️
          </button>
        </div>
      </div>

      {!isOnline && (
        <div className={`mt-4 p-4 border rounded-2xl text-[10px] font-black ${isDark ? 'bg-amber-900/30 border-amber-500/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          ✅ الميزة: أنت حالياً في وضع عدم الاتصال، رفيقك يستخدم المعرفة المحلية الموثوقة.
        </div>
      )}
    </div>
  );
};

export default Assistant;
