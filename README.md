Turtl mobile
============

Welcome! To build Turtl mobile, clone the project next to the [js](https://github.com/turtl/js)
project. You'll want to have cordova installed:

```bash
npm install -g cordova
```

To setup the project:

```bash
cd /path/to/turtl/mobile/www
ln -s ../../js ./app
cd ..
```

Now you can build the app:

```bash
./scripts/gen-index     # creates www/index.html
cordova build android
```

`cordova build` downloads all needed cordova platform/plugin files for you.

If all goes well, you can then run with 

```
cordova run <platform> [--device]
```

Note that Turtl mobile currently only supports the Android platform. iOS support
in the works!

