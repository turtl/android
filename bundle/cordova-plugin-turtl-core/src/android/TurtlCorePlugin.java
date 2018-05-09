package com.lyonbros.turtl-core;

import org.apache.cordova.*;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class SecureCachePlugin extends CordovaPlugin
{
	private CallbackContext cb = null;

	@Override
	public void initialize(CordovaInterface cordova, CordovaWebView webView)
	{
		super.initialize(cordova, webView);

		Context context = cordova.getActivity().getApplicationContext();

		//LocalBroadcastManager manager = LocalBroadcastManager.getInstance(this);
		IntentFilter filter = new IntentFilter();
		filter.addAction(SecureCacheService.RECEIVE_CACHE);
		context.registerReceiver(bReceiver, filter);
	}

	private void comm(Intent intent, CallbackContext callback)
	{
		Context context = this.cordova.getActivity().getApplicationContext();
		cb = callback;
		context.startService(intent);
	}

	private BroadcastReceiver bReceiver = new BroadcastReceiver()
	{
		@Override
		public void onReceive(Context context, Intent intent)
		{
			if(intent.getAction().equals(SecureCacheService.RECEIVE_CACHE))
			{
				String data = intent.getStringExtra("data");
				result(data);
			}
		}
	};

	private void result(String data)
	{
		if(cb == null) return;
		cb.success(data);
		cb = null;
	}

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callback) throws JSONException
	{
		if(cb != null)
		{
			callback.error("in_use");
			return false;
		}

		Context context = this.cordova.getActivity().getApplicationContext();
		Intent intent = new Intent(context, SecureCacheService.class);
		intent.putExtra("action", action);
		if(action.equals("set"))
		{
			intent.putExtra("data", args.getString(0));
			comm(intent, callback);
			return true;
		}
		if(action.equals("foreground"))
		{
			intent.putExtra("title", args.getString(0));
			intent.putExtra("text", args.getString(1));
			comm(intent, callback);
			return true;
		}
		else if(action.equals("wipe") || action.equals("get") || action.equals("unforeground") || action.equals("stop"))
		{
			comm(intent, callback);
			return true;
		}
		else
		{
			cb = null;
		}
		return false;
	}
}

