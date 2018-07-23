package com.lyonbros.turtlstore;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Base64;
import android.util.Log;

public class TurtlStorePlugin extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callback) throws JSONException {
		final SecurityStore store = new SecurityStore(this.cordova.getContext());

		if(action.equals("save")) {
			// TODO would be better to get a byte-array as input.
			String keyBased64 = args.getString(0);
			Log.i("turtl_store", "save in store");
			byte[] key = Base64.decode(keyBased64, Base64.DEFAULT);
			return store.storeKey(key);
		}

		if(action.equals("load")) {
		    byte[] key = store.loadKey();
		    if(key == null) {
				callback.error("No data found");
			} else {
		        callback.success(key);
			}
			return true;
		}
		return false;
	}
}

