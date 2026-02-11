import React, { useState, useEffect, useRef } from 'react';
import { FULL_SURAHS } from '../constants';
import microphoneRecorder from '../services/microphoneRecorder';
import localAudioManager from '../services/localAudioManager';
import offlineStorage from '../services/offlineStorage';
import { useTheme } from '../context/ThemeContext';

interface RecordingMetadata {
  id: string;
  timestamp: number;
  duration: number;
  surahId?: number;
  surahName?: string;
}

const Tasme_a: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedSurah, setSelectedSurah] = useState(FULL_SURAHS[0]);
  const [recordings, setRecordings] = useState<RecordingMetadata[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load recordings on mount
  useEffect(() => {
    loadRecordings();
    checkMicrophonePermission();

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  // Update recording time
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  /**
   * Check microphone permission
   */
  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions?.query({ name: 'microphone' as any });
      if (permission?.state === 'granted') {
        setPermissionGranted(true);
      }
    } catch (e) {
      console.log('Permission check not fully supported');
    }
  };

  /**
   * Load saved recordings
   */
  const loadRecordings = async () => {
    try {
      const saved = localStorage.getItem('tasme_recordings');
      if (saved) {
        setRecordings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  /**
   * Start recording
   */
  const handleStartRecording = async () => {
    try {
      setErrorMessage('');
      const success = await microphoneRecorder.startRecording(`tasme_${selectedSurah.id}_${Date.now()}`);

      if (!success) {
        setErrorMessage('فشل في الوصول إلى الميكروفون. تأكد من الأذونات.');
        return;
      }

      setIsRecording(true);
      setRecordingTime(0);
      setPermissionGranted(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage('خطأ في بدء التسجيل');
    }
  };

  /**
   * Stop recording
   */
  const handleStopRecording = async () => {
    try {
      const recordingId = await microphoneRecorder.stopRecording();

      if (recordingId) {
        // Save metadata
        const metadata: RecordingMetadata = {
          id: recordingId,
          timestamp: Date.now(),
          duration: recordingTime,
          surahId: selectedSurah.id,
          surahName: selectedSurah.name,
        };

        const newRecordings = [metadata, ...recordings];
        setRecordings(newRecordings);
        localStorage.setItem('tasme_recordings', JSON.stringify(newRecordings));

        setIsRecording(false);
        setRecordingTime(0);
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setErrorMessage('خطأ في إيقاف التسجيل');
    }
  };

  /**
   * Play recording
   */
  const handlePlayRecording = async (recordingId: string) => {
    try {
      if (playingId === recordingId) {
        microphoneRecorder.releaseMicrophone();
        setPlayingId(null);
        return;
      }

      const recording = await microphoneRecorder.getRecording(recordingId);
      if (recording) {
        // Play using HTML5 Audio with data URL
        const blob = new Blob([recording.audio], { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.play();
          setPlayingId(recordingId);

          audioRef.current.onended = () => {
            setPlayingId(null);
            URL.revokeObjectURL(url);
          };
        }
      }
    } catch (error) {
      console.error('Error playing recording:', error);
      setErrorMessage('خطأ في تشغيل التسجيل');
    }
  };

  /**
   * Delete recording
   */
  const handleDeleteRecording = async (recordingId: string) => {
    try {
      await microphoneRecorder.deleteRecording(recordingId);
      const newRecordings = recordings.filter((r) => r.id !== recordingId);
      setRecordings(newRecordings);
      localStorage.setItem('tasme_recordings', JSON.stringify(newRecordings));
    } catch (error) {
      console.error('Error deleting recording:', error);
      setErrorMessage('خطأ في حذف التسجيل');
    }
  };

  /**
   * Format time
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-50'} p-4`}>
      <audio ref={audioRef} />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🎙️</span>
            <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              التسميع
            </h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            سجّل قراءتك للقرآن وحسّن من تلاوتك
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* Surah Selection */}
        <div className={`mb-6 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 border ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
          <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            اختر السورة
          </h2>
          <select
            value={selectedSurah.id}
            onChange={(e) => {
              const surah = FULL_SURAHS.find((s) => s.id === parseInt(e.target.value));
              if (surah) setSelectedSurah(surah);
            }}
            className={`w-full p-3 rounded-lg border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'}`}
          >
            {FULL_SURAHS.map((surah) => (
              <option key={surah.id} value={surah.id}>
                {surah.id}. {surah.name}
              </option>
            ))}
          </select>
        </div>

        {/* Recording Control */}
        <div className={`mb-8 ${isDark ? 'bg-gradient-to-r from-purple-900 to-purple-800' : 'bg-gradient-to-r from-purple-100 to-purple-50'} rounded-lg p-6 border ${isDark ? 'border-purple-700' : 'border-purple-300'}`}>
          <div className="text-center mb-6">
            <div className={`text-6xl font-bold mb-4 font-mono ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
              {formatTime(recordingTime)}
            </div>
            <p className={`text-lg ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
              {isRecording ? '🔴 جاري التسجيل...' : 'جاهز للتسجيل'}
            </p>
          </div>

          <div className="flex gap-4">
            {!isRecording ? (
              <button
                onClick={handleStartRecording}
                className="flex-1 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-lg"
              >
                🎤 ابدأ التسجيل
              </button>
            ) : (
              <button
                onClick={handleStopRecording}
                className="flex-1 py-4 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition text-lg"
              >
                ⏹️ إيقاف التسجيل
              </button>
            )}
          </div>

          {!permissionGranted && !isRecording && (
            <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-900'}`}>
              ⚠️ اضغط على "ابدأ التسجيل" لإعطاء أذن الميكروفون
            </div>
          )}
        </div>

        {/* Saved Recordings */}
        <div>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            التسجيلات المحفوظة ({recordings.length})
          </h2>

          {recordings.length === 0 ? (
            <div className={`text-center p-8 ${isDark ? 'bg-slate-800' : 'bg-slate-100'} rounded-lg`}>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                لا توجد تسجيلات محفوظة بعد
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {recording.surahName}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {new Date(recording.timestamp).toLocaleDateString('ar-SA')} •{' '}
                        {formatTime(recording.duration)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handlePlayRecording(recording.id)}
                      className={`flex-1 py-2 rounded-lg font-bold transition ${
                        playingId === recording.id
                          ? 'bg-red-600 text-white'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {playingId === recording.id ? '⏹️ إيقاف' : '▶️ استمع'}
                    </button>
                    <button
                      onClick={() => handleDeleteRecording(recording.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className={`mt-8 p-6 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-blue-50'} border ${isDark ? 'border-slate-700' : 'border-blue-200'}`}>
          <h3 className={`font-bold mb-3 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
            💡 نصائح التسميع
          </h3>
          <ul className={`list-disc list-inside space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <li>سجّل قراءتك بهدوء مع تركيز على التجويد</li>
            <li>استمع للتسجيل وقارنه بقراءة الشيخ</li>
            <li>كرّر التسجيل حتى تحسّن قراءتك</li>
            <li>جميع التسجيلات تُحفظ محلياً في جهازك</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tasme_a;
