package com.lyonbros.turtlstore;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Base64;
import android.util.Log;

public class TurtlStorePlugin extends CordovaPlugin {

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callback) throws JSONException {
		final SecurityStore store = new SecurityStore(this.cordova.getActivity().getApplicationContext());

		if(action.equals("save")) {
			// TODO would be better to get a byte-array as input.
			String keyBased64 = args.getString(0);
			Log.i("turtl_store", "save in store (b64): "+keyBased64.length());
			byte[] key = Base64.decode(keyBased64, Base64.DEFAULT);
			Log.i("turtl_store", "save in store (bin): "+key.length);
			boolean success = store.storeKey(key);
			callback.success("{\"success\":"+success+"}");
			return true;
		}

		if(action.equals("load")) {
			byte[] key = store.loadKey();
			if(key == null) {
				callback.success("{\"key\":null}");
			} else {
				Log.i("turtl_store", "got key of length "+key.length);
				String keyBased64 = Base64.encodeToString(key, Base64.NO_WRAP);
				callback.success("{\"key\":\""+keyBased64+"\"}");
			}
			return true;
		}

		if(action.equals("clear")) {
			store.clear();
			callback.success("{\"success\":true}");
			return true;
		}

		return false;
	}
}

