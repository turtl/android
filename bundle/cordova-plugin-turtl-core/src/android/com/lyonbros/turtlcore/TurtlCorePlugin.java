package com.lyonbros.turtlcore;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.util.Log;

public class TurtlCorePlugin extends CordovaPlugin {
	private boolean library_loaded = false;

	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callback) throws JSONException {
		JSONObject core_response = new JSONObject();
		if(!library_loaded) {
			try {
				TurtlCoreNative.loadLibrary();
				library_loaded = true;
			} catch(Throwable e) {
				core_response.put("code", "native_load_error");
				core_response.put("msg", e.getMessage());
				// hope the error has no quotes...
				callback.error(core_response.toString());
				e.printStackTrace();
				return true;
			}
		}

		if(action.equals("start")) {
			String config = args.getString(0);
			Log.i("turtl_core", "starting core:"+config);
			int res = TurtlCoreNative.startTurtl(config);
			if(res == 0) {
				callback.success("0");
			} else {
				core_response.put("msg", "could not init turtl");
				core_response.put("code", String.valueOf(res));
				callback.error(core_response.toString());
			}
			return true;
		}

		if(action.equals("send")) {
			String message = args.getString(0);
			int res = TurtlCoreNative.sendMessage(message.getBytes());
			if(res == 0) {
				callback.success("0");
			} else {
				core_response.put("msg", "could not send message");
				core_response.put("code", String.valueOf(res));
				callback.error(core_response.toString());
			}
			return true;
		}

		if(action.equals("recv")) {
			String mid = "";
			if(args.length() > 0) {
				mid = args.getString(0);
			}
			byte[] msg_bytes = TurtlCoreNative.recvMessage(mid);
			if(msg_bytes == null) {
				core_response.put("msg", "error receiving message");
				callback.error(core_response.toString());
				return true;
			}
			String msg = null;
			try {
				msg = new String(msg_bytes, "UTF-8");
			} catch(Exception e) {
				core_response.put("msg", e.getMessage());
				callback.error(core_response.toString());
				return true;
			}
			callback.success(msg);
			return true;
		}

		if(action.equals("recv_nb")) {
			String mid = "";
			if(args.length() > 0) {
				mid = args.getString(0);
			}
			byte[] msg_bytes = TurtlCoreNative.recvMessageNb(mid);
			if(msg_bytes == null) {
				callback.success("");
				return true;
			}
			String msg = null;
			try {
				msg = new String(msg_bytes, "UTF-8");
			} catch(Exception e) {
				core_response.put("msg", e.getMessage());
				callback.error(core_response.toString());
				return true;
			}
			callback.success(msg);
			return true;
		}

		if(action.equals("recv_event")) {
			byte[] msg_bytes = TurtlCoreNative.recvEvent();
			if(msg_bytes == null) {
				callback.error("{\"msg\":\"error receiving event\"}");
				return true;
			}
			String msg = null;
			try {
				msg = new String(msg_bytes, "UTF-8");
			} catch(Exception e) {
				core_response.put("msg", e.getMessage());
				callback.error(core_response.toString());
				return true;
			}
			callback.success(msg);
			return true;
		}

		if(action.equals("recv_event_nb")) {
			byte[] msg_bytes = TurtlCoreNative.recvEventNb();
			if(msg_bytes == null) {
				callback.success("");
				return true;
			}
			String msg = null;
			try {
				msg = new String(msg_bytes, "UTF-8");
			} catch(Exception e) {
				core_response.put("msg", e.getMessage());
				callback.error(core_response.toString());
				return true;
			}
			callback.success(msg);
			return true;
		}

		if(action.equals("lasterr")) {
			try {
				String error = TurtlCoreNative.lastError();
				callback.success(error);
			} catch(Exception e) {
				core_response.put("msg", e.getMessage());
				callback.error(core_response.toString());
			}
			return true;
		}
		return false;
	}
}

