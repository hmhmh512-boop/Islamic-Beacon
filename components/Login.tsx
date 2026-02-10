
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [remember, setRemember] = useState(true);

  const handleMockLogin = () => {
    if (!name.trim()) return;
    const user: User = {
      name: name,
      email: `${name.toLowerCase()}@gmail.com`,
      photo: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=064e3b&color=fff',
      isLoggedIn: true
    };
    if (remember && typeof window !== 'undefined') {
      window.localStorage.setItem('noor_saved_user_name', name);
    }
    onLogin(user);
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedName = window.localStorage.getItem('noor_saved_user_name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="animate-fade h-[70vh] flex flex-col items-center justify-center space-y-8 px-6">
      <div className="w-24 h-24 bg-[#064e3b] rounded-[2rem] flex items-center justify-center text-5xl shadow-2xl border-b-4 border-gold-muted">
        🌙
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-emerald-950 quran-text">مرحباً بك في نور الهدى</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
          تسجيل دخول محلي لحفظ تقدمك وبياناتك على هذا الجهاز فقط
        </p>
      </div>

      <div className="w-full max-w-[350px] space-y-4">
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك الكريم..."
          className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-900/10 focus:border-[#f59e0b] outline-none text-center font-bold"
        />
        <label className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="w-3 h-3 rounded border-slate-400"
          />
          <span>تذكر اسمي على هذا الجهاز لتسهيل الدخول لاحقاً</span>
        </label>
        <button 
          onClick={handleMockLogin}
          className="w-full bg-[#064e3b] text-white py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all border-b-4 border-black/20"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6 bg-white rounded-full p-1" alt="google" />
          <span>المتابعة عبر جوجل</span>
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center leading-relaxed max-w-[250px]">
        بتسجيل دخولك، فإنك توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بنا.
      </p>
    </div>
  );
};

export default Login;
