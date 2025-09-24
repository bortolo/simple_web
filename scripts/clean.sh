#!/bin/bash
echo "=== ⚙️ Pulizia delle cartelle ==="
rm -rf /var/www/html/*
mkdir -p /home/ec2-user/proxy
rm -rf /home/ec2-user/proxy/*
mkdir -p /home/ec2-user/reverse_proxy
rm -rf /home/ec2-user/reverse_proxy/*
