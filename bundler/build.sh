#!/bin/bash

echo ""
echo "  > Compile CoffeeScript to JavaScript"
rm -rf compiled
mkdir compiled
coffee --compile --bare --output ./compiled/ ../source/client/

coffee bundle
rm -rf compiled
