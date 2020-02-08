#!/bin/bash
set -e

for p in $(./lsprj.sh)
do
    (cd $p; if [ ! -d node_modules ]; then npm ci; fi; npm run lint)
done

for p in $(./lsprj.sh)
do
    (cd $p; npm run coverage)
done
