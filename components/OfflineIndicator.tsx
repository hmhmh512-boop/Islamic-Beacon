import React, { useEffect, useState } from 'react';
import offlineSystemManager from '../services/offlineSystemManager';
import { useTheme } from '../context/ThemeContext';

interface OfflineStatus {
  isOnline: boolean;
  canSync: boolean;
  lastSyncTime: number;
  cacheSize: number;
  isCaching: boolean;
}

const OfflineIndicator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [status, setStatus] = useState<OfflineStatus>(offlineSystemManager.getStatus());

  useEffect(() => {
    const unsubscribe = offlineSystemManager.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (status.isOnline) {
    return null; // Don't show when online
  }

  return (
    <div
      className={`fixed top-4 left-4 right-4 p-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
        isDark
          ? 'bg-yellow-900 border border-yellow-700 text-yellow-200'
          : 'bg-yellow-100 border border-yellow-300 text-yellow-900'
      }`}
    >
      <span className="text-xl">📡</span>
      <div className="flex-1">
        <p className="font-bold text-sm">وضع بدون انترنت</p>
        <p className="text-xs opacity-75">التطبيق يعمل بدون إنترنت • الذاكرة: {formatSize(status.cacheSize)}</p>
      </div>
    </div>
  );
};

export default OfflineIndicator;
