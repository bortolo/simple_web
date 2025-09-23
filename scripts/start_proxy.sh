#!/bin/bash
mkdir -p /home/ec2-user/proxy
cp -r /var/www/html/proxy/* /home/ec2-user/proxy/
chown -R ec2-user:ec2-user /home/ec2-user/proxy
chmod -R 755 /home/ec2-user/proxy
cd /home/ec2-user/proxy
npm install
nohup node proxy.js > proxy.log 2>&1 &