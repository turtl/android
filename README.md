Turtl mobile
============

Let's go over some basic build instructions.

## Setup

Let's assume you have Node.js/NPM install already.

```bash
npm install -g cordova
mkdir turtl
cd turtl/
git clone https://github.com/turtl/js.git
git clone https://github.com/turtl/mobile.git
cd js/
npm install
cd ../mobile/
```

So we grab our Turtl js project's source and the mobile source as siblings (with
the name "js" preserved...renaming `js` to something else will break the build).

## Building

Before you can build, you have to make sure the file `config.js` exists in the proper place. It's safe to use the default settings by running:

```bash
cp ./www/app/config/config.js.default  ./www/app/config/config.js
```

The build is done via a makefile. There are a number of targets, but the main
one we care about is `release-android`:

```bash
make release-android
```

This should grab the needed plugins, run the build, and create the output APKs.

If you want to run Turtl on your device/emulator, do

```bash
make run-android
```

Simple. Probably.

