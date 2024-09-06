# How to set up the webserver with https (nginx, certbot, docker)

[Source tutorial](https://mindsers.blog/en/post/https-using-nginx-certbot-docker/)

## Prerequisites

* You must have a domain (e.g. `snaptags.app`)
* That domain must be connected to your VPS
  * Tutorial I used to link a GoDaddy domain to DigitalOcean droplet: [Link](https://medium.com/@seanconrad_25426/connecting-a-godaddy-domain-to-a-digitalocean-droplet-cb1ed5662d58)
* You must have Docker installed on your VPS

## Steps

1. Comment out the 443 server block in `./nginx/conf/default.conf`
2. Start ONLY the webserver docker container:
  * `docker compose up -d frontend`
3. Run certbot command (dry run), confirm there is a successful dry run message
  * `docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ --dry-run -d snaptags.app`
4. Run certbot command without dry run, to fill the folder with certificates
  * `docker compose run --rm certbot certonly --webroot --webroot-path /var/www/certbot/ -d snaptags.app`
5. Uncomment the 443 server block in `./nginx/conf/default.conf`
6. Restart the running webserver container
  * `docker compose restart`
7. You should be able to access your webserver through your domain with https now
