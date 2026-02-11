package com.noorhuda.islamic;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.util.Calendar;

public class AlarmReceiver extends BroadcastReceiver {
    private static final String TAG = "AlarmReceiver";
    
    public static final String ACTION_ALARM = "com.noorhuda.islamic.ALARM_ACTION";
    public static final String PRAYER_NAME = "prayerName";
    public static final String AUDIO_ASSET = "audioAsset";
    public static final String ENABLE_SOUND = "enableSound";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "Alarm received");
        
        if (ACTION_ALARM.equals(intent.getAction())) {
            String prayerName = intent.getStringExtra(PRAYER_NAME);
            String audioAsset = intent.getStringExtra(AUDIO_ASSET);
            boolean enableSound = intent.getBooleanExtra(ENABLE_SOUND, true);
            
            // Start AdhanService
            Intent serviceIntent = new Intent(context, AdhanService.class);
            serviceIntent.putExtra(PRAYER_NAME, prayerName);
            serviceIntent.putExtra(AUDIO_ASSET, audioAsset);
            serviceIntent.putExtra(ENABLE_SOUND, enableSound);
            
            context.startService(serviceIntent);
            
            Log.d(TAG, "AdhanService started for: " + prayerName);
        }
    }

    public static void scheduleAlarm(Context context, String prayerName, String audioAsset, long triggerAtMillis, boolean enableSound) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        
        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.setAction(ACTION_ALARM);
        intent.putExtra(PRAYER_NAME, prayerName);
        intent.putExtra(AUDIO_ASSET, audioAsset);
        intent.putExtra(ENABLE_SOUND, enableSound);
        
        int requestCode = prayerName.hashCode();
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        if (alarmManager != null) {
            try {
                // Use exact alarm if possible
                alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
                Log.d(TAG, "Alarm scheduled for " + prayerName + " at " + triggerAtMillis);
            } catch (SecurityException e) {
                Log.e(TAG, "Schedule exact alarm failed: " + e.getMessage());
                // Fallback to inexact alarm
                alarmManager.set(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
            }
        }
    }

    public static void cancelAlarm(Context context, String prayerName) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        
        Intent intent = new Intent(context, AlarmReceiver.class);
        intent.setAction(ACTION_ALARM);
        intent.putExtra(PRAYER_NAME, prayerName);
        
        int requestCode = prayerName.hashCode();
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        if (alarmManager != null) {
            alarmManager.cancel(pendingIntent);
            Log.d(TAG, "Alarm cancelled for " + prayerName);
        }
    }
}
