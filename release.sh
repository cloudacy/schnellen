yarn run build;
echo "Following files and directories will be changed:";
rsync -arzhni --delete ./dist/ averi@averi.at:/var/www/vhosts/averi.at/httpdocs/schnellen;
echo "";
read -p "Do you want to release? [y/N]" choice
case "$choice" in
    y|Y ) rsync -arhz --delete ./dist/ averi@averi.at:/var/www/vhosts/averi.at/httpdocs/schnellen;;
    * ) echo "Release aborted.";;
esac
