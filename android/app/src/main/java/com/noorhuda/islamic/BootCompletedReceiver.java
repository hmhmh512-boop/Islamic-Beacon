package com.noorhuda.islamic;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class BootCompletedReceiver extends BroadcastReceiver {
    private static final String TAG = "BootCompletedReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.d(TAG, "Device boot completed, restoring alarms");
            
            // In a real implementation, you would restore saved alarm settings from SharedPreferences
            // For now, we just log the event
            // The Android app will sync with the React app's stored settings on launch
        }
    }
}
