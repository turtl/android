#!/bin/bash

if [ "$(uname -a | grep 'CYGWIN')" == "" ]; then
	CORDOVA="cordova"
else
	CORDOVA="cmd /c cordova"
fi

${CORDOVA} "$@"

