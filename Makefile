ANDROID_SIGN_ALIAS = 
BUILDFLAGS = 

# non-versioned include
-include vars.mk

MOBILE_VERSION = $(shell cat config.xml \
					| grep '^<widget' \
					| sed 's|^.*version="\([^"]\+\)".*|\1|')

allcss = $(shell find ../js/css/ -name "*.css" \
			| grep -v 'reset.css')
alljs = $(shell echo "../js/main.js" \
			&& find ../js/{config,controllers,handlers,library,models,turtl} -name "*.js" \
			| grep -v '(ignore|\.thread\.)')

.PHONY: all clean run-android release-android build-android prepare-android compile-android fdroid release-fdroid run-ios release-ios build-ios prepare-ios compile-ios config-release config-restore

ANDROID_UNSIGNED = platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk
ANDROID_SIGNED = platforms/android/build/outputs/apk/android-armv7-release.apk

all: .build/make-js www/index.html www/version.js

# ------------------------------------------------------------------------------
# Android
# ------------------------------------------------------------------------------
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

prepare-android: all
	./scripts/cordova.sh prepare android $(BUILDFLAGS)

#fdroid: build-android
fdroid:
	rsync \
		-avz \
		--delete \
		--delete-excluded \
		--checksum \
		--exclude='build/' \
		--exclude='android/build/' \
		--exclude='.gradle/' \
		platforms/android/ ../fdroid/app

release-fdroid: fdroid
	cd ../fdroid && ./scripts/release $(MOBILE_VERSION)

# ------------------------------------------------------------------------------
# iOS
# ------------------------------------------------------------------------------
run-ios: all
	./scripts/cordova.sh run ios

release-ios: BUILDFLAGS += --release
release-ios: config-release build-ios config-restore
	# do extra ios signing/packaging (see release-android)

build-ios: compile-ios

compile-ios: prepare-ios
	./scripts/cordova.sh compile ios $(BUILDFLAGS)

prepare-ios: all
	./scripts/cordova.sh prepare ios $(BUILDFLAGS)

# ------------------------------------------------------------------------------
# shared
# ------------------------------------------------------------------------------
config-release: all
	cp www/config.js .build/config.js.tmp
	cp www/config.live.js www/config.js

config-restore:
	mv .build/config.js.tmp www/config.js

www/app/index.html: $(alljs) $(allcss) ../js/index.html
	@echo "- rsync project: " $?
	@rsync \
			-az \
			--exclude=node_modules \
			--exclude=.git \
			--exclude=.build \
			--exclude=tests \
			--delete \
			--delete-excluded \
			--checksum \
			../js/ \
			www/app
	@touch www/app/index.html

www/version.js: ./scripts/gen-index ./config.xml
	@echo "- www/version.js: " $?
	@echo "var cordova_app_version = '$(MOBILE_VERSION)';" > www/version.js

.build/make-js: $(alljs) $(allcss)
	@cd ../js && make
	@touch .build/make-js

# if the app's index changed, we know to change this one
www/index.html: www/app/index.html ./scripts/gen-index
	@echo "- index.html: " $?
	@./scripts/gen-index

clean:
	rm -rf www/app
	rm www/index.html

