#!/usr/bin/env sh

echo "MINE STACK v0.1.0"

apt-get update
apt-get install -y zip unzip curl git

echo "DOWNLOADING SERVER BINARY"
mkdir minecraft_server
curl -o bedrock_server.zip https://minecraft.azureedge.net/bin-linux/bedrock-server-1.19.83.01.zip
unzip -d minecraft_server bedrock_server.zip

echo "Copying over required scripts"
git clone "https://github.com/squizlee/mine-stack.git"
cp mine-stack/user_data_scripts/start_bedrock_server.sh minecraft_server
chmod +x minecraft_server/start_bedrock_server.sh