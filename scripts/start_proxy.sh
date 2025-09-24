#!/bin/bash
echo "=== 🚀 Avvio proxy Node.js ==="
chown -R ec2-user:ec2-user /home/ec2-user/proxy
chmod -R 755 /home/ec2-user/proxy
cd /home/ec2-user/proxy
npm init -y
npm install express node-fetch@2 aws-sdk
nohup node proxy.js > proxy.log 2>&1 &