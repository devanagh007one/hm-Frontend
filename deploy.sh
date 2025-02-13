#!/bin/bash
SERVER_IP="213.210.21.48"
USERNAME="root"
PASSWORD="Q=33HHkAkRRXOilo:v2g"

sshpass -p "$PASSWORD" ssh -o StrictHostKeyChecking=no $USERNAME@$SERVER_IP << EOF
    cd HappMe
    git pull
    npm run build:server
    pm2 restart 21
EOF

echo "Deployment completed!"
