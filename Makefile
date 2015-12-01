.PHONY: all clean run-android release-android build-android prepare-android compile-android config-release config-restore

MOBILE_VERSION = $(shell cat config.xml \
					| grep '^<widget' \
					| sed 's|^.*version="\([^"]\+\)".*|\1|')

allcss = $(shell find ../js/css/ -name "*.css" \
			| grep -v 'reset.css')
alljs = $(shell echo "../js/main.js" \
			&& find ../js/{config,controllers,handlers,library,models,turtl} -name "*.js" \
			| grep -v '(ignore|\.thread\.)')

all: .build/make-js www/index.html www/version.js

run-android: all
	./scripts/cordova.sh run android

release-android: config-release build-android config-restore

build-android: compile-android

compile-android: prepare-android
	./scripts/cordova.sh compile android

prepare-android: all
	./scripts/cordova.sh prepare android

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

