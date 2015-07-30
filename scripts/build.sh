#!/bin/bash

rsync \
	-az \
	--exclude=node_modules \
	--exclude=.git \
	--delete \
	--delete-excluded \
	--checksum \
	../js/ \
	www/app

cordova prepare "$@"

