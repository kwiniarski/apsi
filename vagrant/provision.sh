#!/usr/bin/env bash

# https://gist.github.com/rrosiek/8190550
# https://deb.nodesource.com/setup_0.12
# http://www.microhowto.info/howto/perform_an_unattended_installation_of_a_debian_package.html
# https://www.debian.org/releases/wheezy/i386/apbs03.html.en
# https://docs.mongodb.org/master/tutorial/install-mongodb-on-ubuntu/

export DEBIAN_FRONTEND=noninteractive

# Setup variables
DB_PACKAGE=mariadb-server-5.5 # mysql-server-5.6 or mariadb-server-5.5
HOST_USER=$1
MYSQL_ROOT_PASSWORD=root
DISTRO=$(lsb_release -c -s)

print_status() {
    echo ''
    echo -e "\033[1;32m$1\033[0m"
}

bail() {
    echo -e "\033[1;31mError executing command, exiting\033[0m"
    exit 1
}

exec_cmd_nobail() {
    echo -e "\033[1;34m> $1\033[0m"
    sudo bash -c "$1"
}

exec_cmd() {
    exec_cmd_nobail "$1" || bail
}

if [[ "X${DISTRO}" != "Xtrusty" ]]; then
    print_status "Unsupported Debian distro: ${DISTRO}"
    bail
fi

if [[ -f "/etc/apt/sources.list.d/chris-lea-node_js-$DISTRO.list" ]]; then
    print_status 'Removing Launchpad PPA Repository for NodeJS'
    exec_cmd 'add-apt-repository -y -r ppa:chris-lea/node.js'
    exec_cmd "rm -f /etc/apt/sources.list.d/chris-lea-node_js-${DISTRO}.list"
fi

# MySQL will not start on VM with small memory amount (ex. 512MB). This is because
# Perormance Schama which will allocate 400MB. Together with InnoDB 128MB buffer pool
# size, it is obvious that MySQL will have insufficient memory amount. To overcome this
# we will create swap file during provisioning. Later we will disable Perormance Schema
# to make MySQL start when booting VM.
pgrep mysql > /dev/null 2>&1
if [[ $? != 0 ]]; then
    print_status "Create a 4GB swap file for MySQL"
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile > /dev/null 2>&1
    sudo swapon /swapfile > /dev/null 2>&1
fi

print_status "Adding signing keys to keyring"
exec_cmd 'apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 561F9B9CAC40B2F7 > /dev/null 2>&1' # Phusion Passenger
exec_cmd 'apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1655a0ab68576280 > /dev/null 2>&1' # NodeSource
# exec_cmd 'apt-key adv --keyserver keyserver.ubuntu.com --recv EA312927 > /dev/null 2>&1' # MongoDB

print_status 'Creating apt sources list files'
exec_cmd "echo 'deb https://oss-binaries.phusionpassenger.com/apt/passenger ${DISTRO} main' > /etc/apt/sources.list.d/passenger.list"
exec_cmd "echo 'deb https://deb.nodesource.com/node_4.x ${DISTRO} main' > /etc/apt/sources.list.d/nodesource.list"
exec_cmd "echo 'deb-src https://deb.nodesource.com/node_4.x ${DISTRO} main' >> /etc/apt/sources.list.d/nodesource.list"
# exec_cmd "echo 'deb http://repo.mongodb.org/apt/ubuntu ${DISTRO}/mongodb-org/3.2 multiverse' > /etc/apt/sources.list.d/mongodb-org-3.2.list"

print_status 'Setting default configuration for MySQL'
exec_cmd "echo '${DB_PACKAGE} mysql-server/root_password password ${MYSQL_ROOT_PASSWORD}' | debconf-set-selections"
exec_cmd "echo '${DB_PACKAGE} mysql-server/root_password_again password ${MYSQL_ROOT_PASSWORD}' | debconf-set-selections"

print_status "Populating apt-get cache"
exec_cmd 'apt-get -qq update'
exec_cmd 'apt-get -qq -y upgrade'

# PACKAGES='build-essential libkrb5-dev apt-transport-https ca-certificates nginx nginx-extras passenger nodejs mongodb-org git mc htop'
PACKAGES='build-essential libkrb5-dev apt-transport-https ca-certificates nginx nginx-extras passenger nodejs git mc htop'
print_status "Installing packages"
exec_cmd "apt-get -qq -y install ${PACKAGES} ${DB_PACKAGE}"

# Install npm global packages
print_status "Update npm && install npm global packages"
# exec_cmd "npm install pm2 strongloop --unsafe-perm -p -s -g"
exec_cmd "cd /var/www && rm -rf node_modules && npm install --no-bin-links -p -s && cd -"

# Configure MongoDB
# print_status "Configure MongoDB"
# if [[ -f "/etc/mongod.conf" ]]; then
#   exec_cmd "sed -i 's/127.0.0.1/0.0.0.0/g' /etc/mongod.conf"
# fi
# exec_cmd "service mongod restart > /dev/null 2>&1"

# Configure MySQL
print_status "Configure MySQL/MariaDB (${DB_PACKAGE})"
for MYSQL_USER in 'vagrant' ${HOST_USER}
do
    # Create user with all privilages and acces from any host
    exec_cmd "mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e \"GRANT ALL ON *.* TO '${MYSQL_USER}'@'%';\" > /dev/null 2>&1";
done
for MYSQL_DATABASE in 'test_spiral'
do
    exec_cmd "mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e \"CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};\" > /dev/null 2>&1"
done
exec_cmd "service mysql restart > /dev/null 2>&1"
