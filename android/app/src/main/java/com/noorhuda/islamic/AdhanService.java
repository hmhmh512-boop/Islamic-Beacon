package com.noorhuda.islamic;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.core.app.NotificationCompat;

public class AdhanService extends Service {
    private static final String TAG = "AdhanService";
    private static final int NOTIFICATION_ID = 1001;
    private static final String CHANNEL_ID = "adhan_channel";
    
    private MediaPlayer mediaPlayer;
    private static boolean isPlaying = false;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "onStartCommand called");
        
        if (intent != null) {
            String prayerName = intent.getStringExtra("prayerName");
            String audioAsset = intent.getStringExtra("audioAsset");
            boolean enableSound = intent.getBooleanExtra("enableSound", true);
            
            if (enableSound) {
                playAdhan(audioAsset != null ? audioAsset : "adhan_default.mp3");
            }
            
            showAdhanNotification(prayerName);
        }
        
        // Service will continue running
        return START_STICKY;
    }

    private void playAdhan(String assetFileName) {
        try {
            if (mediaPlayer != null && mediaPlayer.isPlaying()) {
                mediaPlayer.stop();
                mediaPlayer.release();
            }
            
            mediaPlayer = new MediaPlayer();
            
            // Set audio attributes for playback
            AudioAttributes attrs = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build();
            mediaPlayer.setAudioAttributes(attrs);
            
            // Load from assets folder
            String assetPath = "android_asset/" + assetFileName;
            mediaPlayer.setDataSource(assetPath);
            mediaPlayer.prepare();
            mediaPlayer.setVolume(1.0f, 1.0f);
            mediaPlayer.start();
            
            isPlaying = true;
            Log.d(TAG, "Playing Adhan: " + assetFileName);
            
        } catch (Exception e) {
            Log.e(TAG, "Error playing Adhan: " + e.getMessage(), e);
        }
    }

    private void showAdhanNotification(String prayerName) {
        createNotificationChannel();
        
        Intent notificationIntent = new Intent(this, MainActivity.class);
        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                notificationIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle("أذان " + (prayerName != null ? prayerName : "الصلاة"))
                .setContentText("حان وقت الصلاة")
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setCategory(NotificationCompat.CATEGORY_ALARM);
        
        startForeground(NOTIFICATION_ID, builder.build());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Adhan Notifications",
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Notifications for prayer times");
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
            }
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mediaPlayer != null) {
            if (mediaPlayer.isPlaying()) {
                mediaPlayer.stop();
            }
            mediaPlayer.release();
            mediaPlayer = null;
        }
        isPlaying = false;
        Log.d(TAG, "AdhanService destroyed");
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    public static boolean isAdhanPlaying() {
        return isPlaying;
    }
}
