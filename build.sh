#!/bin/bash

echo ""
echo "  > Recompile coffee"

rm -rf package/public/assets/js
coffee --bare --output package/public/assets/js source/client

cd bundler
coffee bundle
