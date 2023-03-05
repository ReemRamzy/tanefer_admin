cd /var/www/tanefer-backoffice
set -e
sudo git pull origin dev
npm install
sudo mv dist/.htaccess /var/www/tanefer-backoffice/.htaccess
npm run build
sudo mv /var/www/tanefer-backoffice/.htaccess dist/.htaccess
