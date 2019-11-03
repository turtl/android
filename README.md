Turtl Android
=============

_Opening an issue? See the [Turtl project tracker](https://github.com/turtl/project-tracker/issues)_

## Building/running

The Android app uses Cordova/the android SDK/node/npm to build, and assumes the following directory structure:

```
turtl/
    js/
    android/
```

It pulls the assets from the `js` project and uses them as the interface, and uses codrova for building the APK. Depending on the architecture of your phone, you'll have to compile the core for either armv7 or armv8 and put the resulting `libturtl_core.so` file into the proper place in `turtl/android/native/``:

```
turtl/
    android/
        native/
            arm64-v8a/        # <- put libturtl_core.so for armv8 here
            armeabi-v7a/      # <- put libturtl_core.so for armv7 here
```

Regarding building the core for specific platforms, if might be helpful to refer to the Turtl build on F-Droid: https://gitlab.com/Rudloff/fdroiddata/commit/a0fb62454c3c98aea19cb0641cd5d1fd74c568ad

The general android build instructions are as follows:

### One time setup

```
cd turtl/js/
npm install
cd ../android
npm install
cordova platform
```

I think that should do it.

### Building

```
make build
```

This builds a debug APK somewhere under `platform/android/`

