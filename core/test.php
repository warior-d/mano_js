<?php


$str = json_encode("#cloud-config\npreserve_hostname: false\nhostname: web_server_machine\npassword: 12345\nchpasswd:\n    expire: false\nssh_pwauth: false      \nwrite_files:\n- content: |\n    <?php\n    define('DBHOST_IP','');\n    ?>\n  owner: 'root:root'\n  path: /var/www/html/core/file.php\n");

print_r($str);

$name = '10.0.0';

$tt = 
<<<LL
#cloud-config
preserve_hostname: false
hostname: web_server_machine
password: 12345
chpasswd:
    expire: false
ssh_pwauth: false      
write_files:
- content: |
    <?php
    define('DBHOST_IP','$name');
    ?>
  owner: 'root:root'
  path: /var/www/html/core/file.php
LL;

$str1 = json_encode($tt);
print_r($str1);
?>