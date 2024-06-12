# ws-front-end

Webster Systems front end for FIX connection

## frontend

This contains the FX panel JS code.
Run it by navigating to frontend directory:

`pm2 start npm --name "ws-frontend" -- start`

`pm2 status`

To ensure start on reboot run

`pm2 save`

`pm2 startup`

See logs

`pm2 logs ws-frontend --lines 100`
`pm2 logs proxy-server --lines 100`

## backend

This contains an express server.
Run it by navigating to backend directory:

`pm2 start server.js --name ws-backend`

PS G:\WS\ws-front-end\backend> npm start

> ws-backend@1.0.0 start
> node server.js

Server running on <http://localhost:3001>

## DNS changes

At Route 53:

- Removed webstersystems.co.uk A record from d32psyrastjep.cloudfront.net. to 13.42.7.2

- Changed <www.webstersystems.co.uk> CNAME record from d32psyrastjep.cloudfront.net. to main.d3m7l2s1elxq2z.amplifyapp.com

- Added <fxapi.webstersystems.co.uk> CNAME record to ec2-13-42-7-2.eu-west-2.compute.amazonaws.com

## Server

Check `ps -ef | grep proxy-server` for running processes.

Check the logs for running processes with

`pm2 logs ws-backend`

`pm2 logs proxy-server --lines 100`

## Logs

`pm2 status`

## IP tables

Due to Linux systems binding to ports below 1024 requiring elevated privileges, I had to change iptables:

sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
sudo iptables-save > /etc/sysconfig/iptables

## SWAP file

On EC2 a low RAM box gets "Killed" for example running `npm update`. Run the following to create a swap file:

`sudo fallocate -l 2G /swapfile`

`sudo chmod 600 /swapfile`

`sudo mkswap /swapfile`

`sudo swapon /swapfile`

`sudo swapon --show`
