.PHONY: all run-android

all: www/index.html

run-android: .build/android
	./scripts/cordova.sh run android

.build/android: www/index.html
	./scripts/cordova.sh build android
	@touch .build/android

# if the app's index changed, we know to change this one
www/index.html: www/app/index.html ./scripts/gen-index
	@echo "- index.html: " $?
	@./scripts/gen-index

