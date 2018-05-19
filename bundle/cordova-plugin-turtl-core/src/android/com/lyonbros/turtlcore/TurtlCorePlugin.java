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
		if(!library_loaded) {
			TurtlCoreNative.loadLibrary();
			library_loaded = true;
		}

		if(action.equals("start")) {
			String config = args.getString(0);
			Log.i("turtl_core", "starting core:"+config);
			int res = TurtlCoreNative.startTurtl(config);
			if(res == 0) {
				callback.success("0");
			} else {
				callback.error("{\"msg\":\"could not init turtl\",\"code\":"+res+"}");
			}
			return true;
		}

		if(action.equals("send")) {
			String message = args.getString(0);
			int res = TurtlCoreNative.sendMessage(message.getBytes());
			if(res == 0) {
				callback.success("0");
			} else {
				callback.error("{\"msg\":\"could not send message\",\"code\":"+res+"}");
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
				callback.error("{\"msg\":\"error receiving message\"}");
				return true;
			}
			String msg = null;
			try {
				msg = new String(msg_bytes, "UTF-8");
			} catch(Exception e) {
				callback.error("{\"msg\":\""+e.getMessage()+"\"}");
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
				callback.error("{\"msg\":\""+e.getMessage()+"\"}");
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
				callback.error("{\"msg\":\""+e.getMessage()+"\"}");
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
				callback.error("{\"msg\":\""+e.getMessage()+"\"}");
			}
			callback.success(msg);
			return true;
		}

		if(action.equals("lasterr")) {
			String error = TurtlCoreNative.lastError();
			callback.success(error);
			return true;
		}
		return false;
	}
}

