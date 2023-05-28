#!/usr/bin/env sh

echo "MINE STACK v0.1.0"

yum install groupinstall "Development Tools"
curl -o glibc-2.25.tar.gz https://ftp.gnu.org/gnu/glibc/glibc-2.25.tar.gz
tar -xvf glibc-2.25.tar.gz
cd glibc-2.25
mkdir build
cd build
../configure --prefix=/usr
make
make install

yum install ec2-instance-connect

mkdir minecraft_server
curl -o bedrock_server.zip https://minecraft.azureedge.net/bin-linux/bedrock-server-1.19.83.01.zip
unzip -d minecraft_server bedrock_server.zip
