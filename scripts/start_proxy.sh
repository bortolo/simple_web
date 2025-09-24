#!/bin/bash
echo "=== 🚀 Avvio script proxy Node.js ==="
# Devo elevarmi a root per cambiare anche la proprietà di proxy.js
sudo chown -R ec2-user:ec2-user /home/ec2-user/proxy
chmod -R 755 /home/ec2-user/proxy
cd /home/ec2-user/proxy
echo "--- Install dipendenze ---"
npm init -y
npm install express node-fetch@2 aws-sdk
echo "--- Avvio processo ---"
nohup node proxy.js > proxy.log 2>&1 &