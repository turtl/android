.PHONY: all clean run-android release-android build-android prepare-android compile-android fdroid release-fdroid run-ios release-ios build-ios prepare-ios compile-ios config-release config-restore refresh-cache-plugin refresh-core-plugin urn

# non-versioned include
-include vars.mk

export SHELL := /bin/bash
export BUILD := build

mkdir = @mkdir -p $(dir $@)

MOBILE_VERSION = $(shell cat config.xml \
					| grep '^<widget' \
					| sed -E 's|^.*version="([^"]+)".*|\1|')

allcss = $(shell find ../js/css/ -name "*.css" \
			| grep -v 'reset.css')
alljs = $(shell echo "../js/main.js" \
			&& find ../js/{config,controllers,handlers,lib,models} -name "*.js" \
			| grep -v '(ignore|\.thread\.)')

ANDROID_UNSIGNED = platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk
ANDROID_SIGNED = platforms/android/build/outputs/apk/android-armv7-release.apk
ANDROID_NATIVE = $(shell find native/android/ -type f -name "*so" | sed 's|native/android/|platforms/android/libs/|')

all: $(BUILD)/make-js www/index.html www/version.js $(ANDROID_NATIVE)

# ------------------------------------------------------------------------------
# Android
# ------------------------------------------------------------------------------
platforms/android/libs/%/libturtl_core.so: native/android/%/libturtl_core.so
	$(mkdir)
	cp $^ $@

run-android: all
	./scripts/cordova.sh run android

release-android: BUILDFLAGS += --release
release-android: config-release build-android config-restore
	jarsigner \
		-verbose \
		-sigalg SHA1withRSA \
		-digestalg SHA1 \
		-keystore ../certs/turtl-android.keystore \
		$(ANDROID_UNSIGNED) \
		$(ANDROID_SIGN_ALIAS)
	rm -f $(ANDROID_SIGNED)
	zipalign \
		-v 4 \
		$(ANDROID_UNSIGNED) \
		$(ANDROID_SIGNED)

build-android: compile-android

compile-android: prepare-android
	./scripts/cordova.sh compile android $(BUILDFLAGS)
	#cordova compile android $(BUILDFLAGS)

prepare-android: all
	./scripts/cordova.sh prepare android $(BUILDFLAGS)

# ------------------------------------------------------------------------------
# shared
# ------------------------------------------------------------------------------
config-release: all
	cp www/config.js $(BUILD)/config.js.tmp
	cp www/config.live.js www/config.js

config-restore:
	mv $(BUILD)/config.js.tmp www/config.js

www/app/index.html: $(alljs) $(allcss) ../js/index.html
	$(mkdir)
	@echo "- rsync project: " $?
	@rsync \
			-azz \
			--exclude=node_modules \
			--exclude=.git \
			--exclude=tests \
			--delete \
			--delete-excluded \
			--checksum \
			../js/ \
			www/app
	@touch $@

www/version.js: ./scripts/gen-index ./config.xml
	@echo "- www/version.js: " $?
	@echo "var cordova_app_version = '$(MOBILE_VERSION)';" > www/version.js

$(BUILD)/make-js: $(alljs) $(allcss)
	$(mkdir)
	@cd ../js && make
	@touch $@

# if the app's index changed, we know to change this one
www/index.html: www/app/index.html ./scripts/gen-index
	@echo "- index.html: " $?
	@./scripts/gen-index

refresh-cache-plugin:
	cordova plugin remove com.lyonbros.securecache
	cordova plugin add https://github.com/lyonbros/cordova-plugin-secure-cache.git

refresh-core-plugin:
	cordova plugin remove com.lyonbros.turtlcore
	cordova plugin add bundle/cordova-plugin-turtl-core/

urn:
	@echo "Is there a Ralphs around here?"

clean:
	rm -rf www/app
	rm -rf $(BUILD)
	rm -rf platforms/android/build platforms/android/CordovaLib/build
	rm -f www/index.html

