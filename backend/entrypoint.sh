#!/bin/sh
set -e

echo "Container's IP address: `awk 'END{print $1}' /etc/hosts`"

cd /backend

git clone https://github.com/PaulCombal/SamRewritten.git

make -C SamRewritten

cp SamRewritten/bin/samrewritten out/samrewritten
cp SamRewritten/bin/libsteam_api.so out/libsteam_api.so
cp SamRewritten/bin/launch.sh out/launch.sh

rm -r SamRewritten