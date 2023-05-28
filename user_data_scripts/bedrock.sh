#!/usr/bin/env sh

echo "MINE STACK v0.1.0"

apt install zip curl


echo "DOWNLOADING SERVER BINARY"
mkdir minecraft_server
curl -o bedrock_server.zip https://minecraft.azureedge.net/bin-linux/bedrock-server-1.19.83.01.zip
unzip -d minecraft_server bedrock_server.zip
