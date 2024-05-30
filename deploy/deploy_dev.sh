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

for destination_vault in "${DESTINATION_VAULT[@]}"
do
    PLUGIN_DESTINATION=$destination_vault/.obsidian/plugins/papyrus
    mkdir -p "$PLUGIN_DESTINATION" # Create the second directory if it doesn't exist
    # Copy files from the script's directory to the second directory
    cp "main.js" "$PLUGIN_DESTINATION/" # Again, adjust as needed for specific files
    cp "manifest.json" "$PLUGIN_DESTINATION/" # Again, adjust as needed for specific files
    cp "styles.css" "$PLUGIN_DESTINATION/" # Again, adjust as needed for specific files

    echo "Deployed in $destination_vault"
done

cd -

echo "Operations completed successfully."
