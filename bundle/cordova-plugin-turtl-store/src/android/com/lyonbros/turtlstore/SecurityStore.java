package com.lyonbros.turtlstore;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.support.annotation.NonNull;
import android.util.Base64;
import android.util.Log;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/**
 * Class which store the turtl-key for stay logged in. This class tries to avoid to throw any
 * exception, because it should be part of a cordova app, where it becomes difficult,
 * to handle the exception appropriate.<br>
 * How safe is the store? The store is as safe as the keystore of android or your additional password.
 * <p>
 * Quote: The Android Keystore system lets you store cryptographic keys in a container to make it
 * more difficult to extract from the device.
 * Once keys are in the keystore, they can be used for cryptographic operations with the key material
 * remaining non-exportable.
 * Moreover, it offers facilities to restrict when and how keys can be used,
 * such as requiring user authentication for key use or restricting keys to be used only in certain
 * cryptographic modes.
 */
public class SecurityStore {

    private static final String LOG_TAG_NAME = "SecurityStore";
    private static final String CIPHER_MODE = "AES/GCM/NoPadding";

    // DONT CHANGE THE VALUE!
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static final String KEY_SUFFIX_IV = ".iv";
    private static final String KEY_SUFFIX_KEY = ".key";

    private final SharedPreferences preferences;



    /**
     * Initialize this object.
     * @param context the context of the android app. Can be get at Cordova-Plugin via <br>
     *                <code>this.cordova.getActivity().getApplicationContext();</code> otherwise
     *                each Activity is a valid context.
     */
    @SuppressLint("HardwareIds")
    public SecurityStore(Context context) {
        this.preferences= PreferenceManager.getDefaultSharedPreferences(context);
    }

    public boolean storeKey(byte[] unencryptedKey, String keyname) {
        try {
            final Cipher cipher = Cipher.getInstance(CIPHER_MODE);
            cipher.init(Cipher.ENCRYPT_MODE, createSecretKey(keyname));
            final byte[] iv = cipher.getIV();
            final byte[] crypteKey = cipher.doFinal(unencryptedKey);
            final SharedPreferences.Editor editor = preferences.edit();
            editor.putString(keyname + KEY_SUFFIX_KEY, Base64.encodeToString(crypteKey, Base64.DEFAULT));
            editor.putString(keyname + KEY_SUFFIX_IV, Base64.encodeToString(iv, Base64.DEFAULT));
            editor.apply();
            return true;
        } catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException |
                BadPaddingException | IllegalBlockSizeException | NoSuchProviderException |
                InvalidAlgorithmParameterException e) {
            Log.e(LOG_TAG_NAME,"Wrong encryption parameter", e);
        }
        preferences.edit().clear().apply();
        return false;
    }

    public boolean storeKey(byte[] unencryptedKey) {
        return storeKey(unencryptedKey, "TurtlLoginSecret");
    }


    /**
     * Loads a saved key (under Keyword TurtlLoginSecret) or <code>null</code> if no key is found.
     *
     * @return the saved key or <code>null</code> if no key is found.
     */

    public byte[] loadKey() {
        return loadKey("TurtlLoginSecret");
    }

    /**
     * Loads a saved key or <code>null</code> if no key is found.
     * @param keyname name under which the key is saved.
     * @return the saved key or <code>null</code> if no key is found.
     */
    public byte[] loadKey(String keyname) {
        final SecretKey secretKey = getSecretKey(keyname);
        if (preferences.contains(keyname+ KEY_SUFFIX_KEY) && secretKey != null) {
            final byte[] storedKey = Base64.decode(preferences.getString(keyname + KEY_SUFFIX_KEY, null), Base64.DEFAULT);
            final byte[] encryptionIv = Base64.decode(preferences.getString(keyname + KEY_SUFFIX_IV, null), Base64.DEFAULT);
            final Cipher cipher;
            try {
                cipher = Cipher.getInstance(CIPHER_MODE);
                final GCMParameterSpec spec = new GCMParameterSpec(128, encryptionIv);
                cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);
                return cipher.doFinal(storedKey);
            } catch (NoSuchAlgorithmException | NoSuchPaddingException |
                    InvalidAlgorithmParameterException | InvalidKeyException |
                    IllegalBlockSizeException | BadPaddingException e) {
                Log.e(LOG_TAG_NAME,"Wrong decryption parameter", e);
            }
        }
        return null;
    }

    @NonNull
    private SecretKey createSecretKey(String keyname) throws NoSuchAlgorithmException,
            NoSuchProviderException, InvalidAlgorithmParameterException {

        final KeyGenerator keyGenerator = KeyGenerator
                .getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);

        keyGenerator.init(new KeyGenParameterSpec.Builder(keyname,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .build());
        return keyGenerator.generateKey();
    }

    private SecretKey getSecretKey(String keyname)  {
        try {
            final KeyStore keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
            keyStore.load(null);
            return ((KeyStore.SecretKeyEntry) keyStore.getEntry(keyname, null)).getSecretKey();
        } catch (KeyStoreException e) {
            Log.e(LOG_TAG_NAME,"No keystore-provider is founded or can't load key from keystore.", e);
        } catch (CertificateException | IOException e) {
            Log.e(LOG_TAG_NAME,"Can't load keystore.", e);
        } catch (NoSuchAlgorithmException e) {
            Log.e(LOG_TAG_NAME,"Can't load keystore or can't load key from keystore.", e);
        } catch (UnrecoverableEntryException e) {
            Log.e(LOG_TAG_NAME,"Can't load key from keystore.", e);
        }
        return null;
    }
}
