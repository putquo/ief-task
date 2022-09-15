#!/bin/bash

VERSION="$1"
FILE="$2"

IFS="." read -ra PARTS <<< "$VERSION"

MAJOR="${PARTS[0]}"
MINOR="${PARTS[1]}"
PATCH="${PARTS[2]}"

sed -i "/Major/c\        \"Major\" : $MAJOR," "$FILE"
sed -i "/Minor/c\        \"Minor\" : $MINOR," "$FILE"
sed -i "/Patch/c\        \"Patch\" : $PATCH" "$FILE"
