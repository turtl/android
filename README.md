Turtl mobile
============

Welcome! To build Turtl mobile, clone the project next to the [js](https://github.com/turtl/js)
project. You'll want to have cordova installed:

```bash
npm install -g cordova
```

Then run `scripts/build.sh`.

This will rsync ../js to www/app, then call `cordova prepare` (which downloads
all needed platforms/plugins for hte project).

You can then run with `cordova run <platform> [--device]`. Note that Turtl mobile
currently only supports the Android platform. iOS support in the works!



