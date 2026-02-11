import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noorhuda.islamic',
  appName: 'Noor Al-Huda',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_notification',
      iconColor: '#13B0F5',
      sound: 'notification'
    }
  }
};

export default config;
