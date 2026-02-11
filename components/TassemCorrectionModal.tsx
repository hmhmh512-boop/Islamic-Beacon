import React, { useState, useEffect } from 'react';
import tassemCorrectorService, { CorrectionResult, TassemSession } from '../services/tassemCorrectorService';
import { useTheme } from '../context/ThemeContext';

interface TassemCorrectionModalProps {
  isOpen: boolean;
  surahNumber: number;
  ayahNumber: number;
  recordedText: string;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

const TassemCorrectionModal: React.FC<TassemCorrectionModalProps> = ({
  isOpen,
  surahNumber,
  ayahNumber,
  recordedText,
  onClose,
  onSubmit
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && recordedText) {
      correctTassem();
    }
  }, [isOpen, recordedText]);

  const correctTassem = async () => {
    setIsLoading(true);
    try {
      const correction = tassemCorrectorService.correctTassem(surahNumber, ayahNumber, recordedText);
      setResult(correction);

      // Save to history
      const session: TassemSession = {
        surahId: surahNumber,
        ayahNumber,
        recordedText,
        score: correction.score,
        timestamp: Date.now(),
        isCorrect: correction.correct
      };
      tassemCorrectorService.saveSession(session);

      // Call callback
      onSubmit(correction.score);
    } catch (error) {
      console.error('Correction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const classes = {
    overlay: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4',
    modal: `rounded-3xl p-6 ${isDark ? 'bg-slate-900' : 'bg-white'} max-w-2xl w-full max-h-96 overflow-y-auto`,
    header: isDark ? 'text-white' : 'text-slate-900',
    text: isDark ? 'text-slate-300' : 'text-slate-700',
    score: result?.correct 
      ? 'text-green-500' 
      : result && result.score >= 70
      ? 'text-amber-500'
      : 'text-red-500'
  };

  if (isLoading) {
    return (
      <div className={classes.overlay}>
        <div className={classes.modal}>
          <p className={classes.header}>جاري تصحيح التسميع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.overlay}>
      <div className={classes.modal}>
        {result && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center border-b border-slate-300 dark:border-slate-700 pb-4">
              <p className={`text-sm ${classes.text}`}>نتيجة التصحيح</p>
              <p className={`text-5xl font-black ${classes.score} mt-2`}>{result.score}%</p>
            </div>

            {/* Feedback */}
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <p className={classes.text}>{result.feedback}</p>
            </div>

            {/* Issues */}
            {result.matchedAyahs[0]?.issues.length > 0 && (
              <div className="space-y-2">
                <p className={`font-bold ${classes.header}`}>نقاط التحسين:</p>
                <ul className="space-y-1">
                  {result.matchedAyahs[0].issues.map((issue, idx) => (
                    <li key={idx} className={`text-sm ${classes.text} flex gap-2`}>
                      <span>•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className={`font-bold ${classes.header}`}>الاقتراحات:</p>
                <ul className="space-y-1">
                  {result.suggestions.map((suggestion, idx) => (
                    <li key={idx} className={`text-sm ${classes.text} flex gap-2`}>
                      <span>💡</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl font-bold transition-all mt-4 ${
                isDark
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              حسناً
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TassemCorrectionModal;
