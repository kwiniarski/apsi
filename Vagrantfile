# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 80, host: 8080 # nginx
  # config.vm.network "forwarded_port", guest: 3000, host: 3000 # application
  # config.vm.network "forwarded_port", guest: 8701, host: 8701 # slc pm
  config.vm.network "forwarded_port", guest: 3306, host: 3306 # MySQL/MariaDB
  # config.vm.network "forwarded_port", guest: 9615, host: 9615 # pm2 web
  # config.vm.network "forwarded_port", guest: 27017, host: 27017 # MongoDB

  # config.vm.network "private_network", ip: "192.168.33.10"
  # config.vm.network "public_network"

  config.vm.synced_folder "./", "/var/www"
  # config.vm.synced_folder "./vagrant", "/vagrant"
  config.vm.synced_folder "./vagrant/mysql/conf.d", "/etc/mysql/conf.d",
    owner: "root",
    group: "root",
    mount_options: ["dmode=644,fmode=644"]
  config.vm.synced_folder "./vagrant/nginx/sites-enabled", "/etc/nginx/sites-enabled"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "spiral"
    vb.gui = false
    vb.cpus = 1
    vb.memory = 1536
    vb.customize ["modifyvm", :id, "--pae", "on"]
    vb.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision "shell" do |sh|
    sh.path = "vagrant/provision.sh"
    sh.keep_color = true
    sh.args = ["#{ENV['USER']}"]
  end

  # config.vm.provision "shell", inline: "node /var/www", run: "always"

  # MariaDB does not seem to bind to 0.0.0.0 on system start so we need to manually restart.
  config.vm.provision "shell", inline: "service mysql restart", run: "always"
  # config.vm.provision "shell", inline: "pm2 start /vagrant/emporium.json -m", run: "always"

end
