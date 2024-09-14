#!/bin/bash

# Load environment variables
source plugin.env

cd "$BRAINIAC_DIR" || exit 1 # exit script if directory change fails

tsc

cd -
cd ..

mkdir -p "libs/papyrus-brainiac"

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cp -r "$BRAINIAC_DIR"/dist/* "$SCRIPT_DIR/libs/papyrus-brainiac" # Modify this line as needed, e.g., specifying specific files

npm run build

cd -

echo "Operations completed successfully."