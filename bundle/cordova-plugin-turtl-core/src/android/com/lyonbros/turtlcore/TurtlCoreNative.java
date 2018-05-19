package com.lyonbros.turtlcore;

public class TurtlCoreNative {
	private static native int start(String config);
	private static native int send(byte[] message);
	private static native byte[] recv(String mid);
	private static native byte[] recv_nb(String mid);
	private static native byte[] recv_event();
	private static native byte[] recv_event_nb();
	private static native String lasterr();

	public static void loadLibrary() {
		System.loadLibrary("turtl_core");
	}

	public static int startTurtl(String config) {
		return start(config);
	}
	public static int sendMessage(byte[] message) {
		return send(message);
	}
	public static byte[] recvMessage(String mid) {
		return recv(mid);
	}
	public static byte[] recvMessageNb(String mid) {
		return recv_nb(mid);
	}
	public static byte[] recvEvent() {
		return recv_event();
	}
	public static byte[] recvEventNb() {
		return recv_event_nb();
	}
	public static String lastError() {
		return lasterr();
	}
}

