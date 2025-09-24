#!/bin/bash
echo "=== ⚙️ Configurazione reverse proxy Apache ==="
# Path template nel repo
TEMPLATE="/var/www/html/reverse_proxy/proxy.conf.template"
DEST="/etc/httpd/conf.d/proxy.conf"
# Recupera IP pubblico della EC2
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
EC2_IP=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Sostituisci il placeholder e salva in /etc/httpd/conf.d
sed "s/{{EC2_IP}}/$EC2_IP/" $TEMPLATE > $DEST
# Controlla sintassi
apachectl configtest
# Riavvia Apache
systemctl restart httpd