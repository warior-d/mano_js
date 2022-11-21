<?php

define('API_MANO_BASE','http://10.0.69.115/osm');
define('POST_TAKE_TOKEN','/admin/v1/tokens');
define('GET_RUNNING_INSTANCES','/nslcm/v1/ns_instances');
define('GET_VIMS','/admin/v1/vim_accounts');
define('POST_VNFD','/vnfpkgm/v1/vnf_packages_content');
define('POST_NSD','/nsd/v1/ns_descriptors_content');
define('POST_NS','/nslcm/v1/ns_instances_content');
define('DELETE_NS','/nslcm/v1/ns_instances_content/');
define('GET_VNFR','/nslcm/v1/vnf_instances');
define('GET_VNFDS', '/vnfpkgm/v1/vnf_packages');
define('CREATE_VIM', '/admin/v1/vims');
//

 if(!empty($_REQUEST)){
	if(function_exists($_REQUEST['action']))
	{
	  call_user_func($_REQUEST['action']);
	}
	die();
}




function createEDGE()
{
	include "jsons.php";
							
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$url_edge = $_REQUEST['url_edge'];
	$tenant_name = $_REQUEST['tenant_name'];
	$user_edge = $_REQUEST['user_edge'];
	$pass_edge = $_REQUEST['pass_edge'];

	$nsd = getEDGE($name, $url_edge, $tenant_name, $user_edge, $pass_edge);	

	//print_r($nsd);

	$ch = curl_init(API_MANO_BASE.CREATE_VIM);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}






























function getNsStates(){

	$token = $_REQUEST['token'];
	$obj = $_REQUEST['obj'];
	
	$count_in = count($obj);
	
	$ch = curl_init(API_MANO_BASE.GET_RUNNING_INSTANCES);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	$decoded_json_nss = json_decode($res, true);
	
	$new_obj = [];

	for($i = 0; $i < count($decoded_json_nss); $i++){
		foreach($decoded_json_nss[$i] as $key=>$value){
			if($key == "_id"){
				for($y = 0; $y < count($obj); $y++){
					foreach($obj[$y] as $k=>$v){
						if(($k == 'id') && $v == $value){
							$obj[$y]["state"] = $decoded_json_nss[$i]["nsState"];
							$new_arr = [];
							$new_arr["id"] = $decoded_json_nss[$i]["_id"];
							$new_arr["state"] = $decoded_json_nss[$i]["nsState"];
							array_push($new_obj, $new_arr);
						}
					}
				}
			}
		}		
	}
	
	$json_out = json_encode($new_obj);
	print_r($json_out);
}






function createVNFDinternet()
{
	
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name'];
	
	$internalNetwork = $_REQUEST['internalNetwork'];	
	$externalNetwork = $_REQUEST['externalNetwork'];
	
	$vim = $_REQUEST['vim'];
	$cloud_config = '';

	$vnfd_name = $name.'_vnf';

$cld = 
<<<LL
#cloud-config
vyos_config_commands:
  - set service ssh port 22  
  - set system login user vyos authentication plaintext-password 'vyospass'
  - set system host-name 'vyos-1-single'
  - set interfaces ethernet eth0 address 'dhcp'
  - set interfaces ethernet eth0 description 'mgmt iface'
  - delete interfaces ethernet eth1 address 'dhcp'
  - set interfaces ethernet eth1 address '192.168.0.1/24'
  - set interfaces ethernet eth1 description 'internal'
  - set nat source rule 100 outbound-interface 'eth0'
  - set nat source rule 100 source address '192.168.0.0/24'
  - set nat source rule 100 translation address 'masquerade'
LL;


	
	$cloud_config = json_encode($cld);

    $vnfd = getVNFdInternet($vnfd_name, $cloud_config);
	$ch = curl_init(API_MANO_BASE.POST_VNFD);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Connection: keep-alive',
	'Accept: application/json', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $vnfd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_vnfd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_vnfd;
}



function createNSDinternet()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$internalNetwork = $_REQUEST['internalNetwork'];	
	$externalNetwork = $_REQUEST['externalNetwork'];

	$vnfd_name = $name.'_vnf';
	$nsd_name = $name.'_ns';
	$nsd = getNSdInternet($nsd_name, $vnfd_name, $internalNetwork, $externalNetwork);	

	$ch = curl_init(API_MANO_BASE.POST_NSD);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}


function createNSinternet()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$vim = $_REQUEST['vim'];
	$ns_id = $_REQUEST['ns_id'];
	$instanceType = $_REQUEST['instanceType'];

	$nsd = getNetServinternet($name, $instanceType, $ns_id, $vim);	

	$ch = curl_init(API_MANO_BASE.POST_NS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}












function getOpenstackToken()
{
	
	include "jsons.php";
	
	$api_openstack = $_REQUEST['api_openstack'];
	$openstack_user = $_REQUEST['openstack_user'];
	$openstack_pass = $_REQUEST['openstack_pass'];
	$openstack_tenant = $_REQUEST['openstack_tenant'];
	$openstack_machine_id = $_REQUEST['openstack_machine_id'];
	
	$os_token_url = '/auth/tokens';
	
	$json_os = getOStoken($openstack_user, $openstack_pass, $openstack_tenant);
	$headers = [];
	$ch = curl_init($api_openstack.$os_token_url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
	'Accept: application/json'));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $json_os); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	curl_setopt($ch, CURLOPT_HEADERFUNCTION,
		function($curl, $header) use (&$headers)
	{
		$len = strlen($header);
		$header = explode(':', $header, 2);
		if (count($header) < 2) // ignore invalid headers
		  return $len;

		$headers[strtolower(trim($header[0]))][] = trim($header[1]);
		
		return $len;
	  }
	);
	
	$arr_token = curl_exec($ch);
	curl_close($ch);

	
	$response_array = json_decode($arr_token, true);
	$token_os_arr = $headers['x-subject-token'];
	$out_x_token = $token_os_arr;
	$x_token = $token_os_arr[0];
	$project_id = $response_array['token']['project']['id'];
	$compute_api_url = '';
	
	for($i = 0; $i < count($response_array['token']['catalog']); $i++){
		
		$inner_arr = $response_array['token']['catalog'][$i];
		
		if($inner_arr['type'] == 'compute'){
			$compute_api_url = $inner_arr['endpoints']['0']['url'];
		}
		
	}

	$data= getOS();
	$url_get_cons = $compute_api_url.'/servers/'.$openstack_machine_id.'/remote-consoles';

	$ch = curl_init($url_get_cons);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
	'X-OpenStack-Nova-API-Version: 2.6', 
	'X-Auth-Token: '.$x_token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$url_nvc = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	
	$url_arr = json_decode($url_nvc, true);
	$clear_url = $url_arr['remote_console']['url'];
	
	echo json_encode($clear_url);
}



function getVNFR()
{
	
	$token = $_REQUEST['token'];

	$ch = curl_init(API_MANO_BASE.GET_VNFR);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token,
	'Content-Length: '.mb_strlen($data)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	#print_r($res);
	echo $res;
	
}










function createVNFDwsdb()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name'];
	
	$imageWS = $_REQUEST['imageIDWS'];	
	$imageDB = $_REQUEST['imageIDDB'];
	
	$ramWS = $_REQUEST['ramWS'];
	$vcpuWS = $_REQUEST['vCPUWS'];
	$storageWS = $_REQUEST['storageWS'];

	$ramDB = $_REQUEST['ramDB'];
	$vcpuDB = $_REQUEST['vCPUDB'];
	$storageDB = $_REQUEST['storageDB'];
	
	$network = $_REQUEST['network'];
	$vim = $_REQUEST['vim'];
	$cloud_config = '';
	$ipDB = $_REQUEST['ipDB'];


	$vnfd_name = $name.'_vnf';
	

$cld = 
<<<LL
#cloud-config
password: 12345
chpasswd:
    expire: false
ssh_pwauth: false      
write_files:
- content: |
    <?php
    define('DBHOST_IP','$ipDB');
    ?>
  owner: 'root:root'
  path: /var/www/html/core/dbhost.php
LL;
	
	$cloud_config = json_encode($cld);
	
    $vnfd = getVNFdWSDB($vnfd_name, $imageWS, $imageDB, $ramWS, $vcpuWS, $storageWS, $ramDB, $vcpuDB, $storageDB, $ipDB, $cloud_config, $ipWS);

	$ch = curl_init(API_MANO_BASE.POST_VNFD);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json', 'Connection: keep-alive',
	'Accept: application/json', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $vnfd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_vnfd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_vnfd;
}


function createNSDwsdb()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$network = $_REQUEST['network'];
	$ipDB = $_REQUEST['ipDB'];
	$vim = $_REQUEST['vim'];
	$ipWS = $_REQUEST['ip_web_server'];

	$vnfd_name = $name.'_vnf';
	$nsd_name = $name.'_ns';
	$nsd = getNSdWSDB($nsd_name, $vnfd_name, $network, $ipDB, $ipWS);	

	$ch = curl_init(API_MANO_BASE.POST_NSD);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}


function createNSwsdb()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$vim = $_REQUEST['vim'];
	$ns_id = $_REQUEST['ns_id'];
	$instanceType = $_REQUEST['instanceType'];

	$nsd = getNetServWSDB($name, $instanceType, $ns_id, $vim);	

	$ch = curl_init(API_MANO_BASE.POST_NS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}




#
#	Надо в каждом запросе предусмотреть возврат UNATHORIZE
#


function createVNFD()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$image = $_REQUEST['imageID'];
	$ram = $_REQUEST['ram'];
	$vcpu = $_REQUEST['vCPU'];
	$storage = $_REQUEST['storage'];
	$network = $_REQUEST['network'];
	$vim = $_REQUEST['vim'];
	$cloud_config = '';
	$pass = $_REQUEST['pass'];

$cld = 
<<<LL
#cloud-config
password: $pass
chpasswd:
    expire: false
ssh_pwauth: false
LL;

	$cloud_config = json_encode($cld);

	$vnfd_name = $name.'_vnf';
    $vnfd = getVNFd($vnfd_name, $image, $ram, $vcpu, $storage, $cloud_config);
	$ch = curl_init(API_MANO_BASE.POST_VNFD);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $vnfd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_vnfd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_vnfd;
}



function createNSD()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$image = $_REQUEST['imageID'];
	$ram = $_REQUEST['ram'];
	$vcpu = $_REQUEST['vCPU'];
	$storage = $_REQUEST['storage'];
	$network = $_REQUEST['network'];
	$vim = $_REQUEST['vim'];
	$cloud_config = '';

	$vnfd_name = $name.'_vnf';
	$nsd_name = $name.'_ns';
	$nsd = getNSd($nsd_name, $vnfd_name, $network);	

	$ch = curl_init(API_MANO_BASE.POST_NSD);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}



function createNS()
{
	include "jsons.php";
	
	$token = $_REQUEST['token'];
	$name = $_REQUEST['name']; 
	$image = $_REQUEST['imageID'];
	$ram = $_REQUEST['ram'];
	$vcpu = $_REQUEST['vCPU'];
	$storage = $_REQUEST['storage'];
	$network = $_REQUEST['network'];
	$vim = $_REQUEST['vim'];
	$cloud_config = '';
	$ns_id = $_REQUEST['ns_id'];
	$instanceType = $_REQUEST['instanceType'];

	$nsd = getNetServ($name, $instanceType, $ns_id, $vim);	

	$ch = curl_init(API_MANO_BASE.POST_NS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $nsd); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$id_nsd = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	echo $id_nsd;
}




function deleteInstance()
{
	$token = $_REQUEST['token'];
	$ns_id = $_REQUEST['instance_id'];

	$ch = curl_init(API_MANO_BASE.DELETE_NS.$ns_id);
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token,
	'Content-Length: '.mb_strlen($data)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	#print_r($res);
	echo $res;
}



function getInstancesAndVims()
{
	$token = $_REQUEST['token'];

	$ch = curl_init(API_MANO_BASE.GET_VNFDS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res_vnfd = curl_exec($ch);
	curl_close($ch);
	$decoded_json_vnfd = json_decode($res_vnfd, true);
	
	$arrVnfds = [];
	$needed_vnfd_params = ["_id","name","id","vdu"];
	$need_vdu_params = ["id","cloud-init"];
	$arrVdus = [];
	
	
	for($i = 0; $i < count($decoded_json_vnfd); $i++){
		foreach($decoded_json_vnfd[$i] as $key=>$value){
			if(in_array($key, $needed_vnfd_params)){
				if($key == "vdu"){
					for($g = 0; $g < count($decoded_json_vnfd[$i][$key]); $g++){
						foreach($decoded_json_vnfd[$i][$key][$g] as $key_vdu=>$value_vdu){
							if(in_array($key_vdu, $need_vdu_params)){
								$arrVnfds[$i][$key][$g][$key_vdu] = $value_vdu;
								if($key_vdu == 'cloud-init'){
									$str_json = json_encode($value_vdu);
									$arrVnfds[$i][$key][$g]['password'] = $str_json.strpos($str_json, 'password:');
									
									if(strpos($str_json, 'password:') > 0){
										$arrVnfds[$i][$key][$g]['password'] = 'truhno';
										$start = strpos($str_json, 'password:');
										$str = substr($str_json, $start + strlen('password: '), strpos($str_json, '\n', $start) - $start - strlen('password: '));
										$arrVnfds[$i][$key][$g]['password'] = $str;
										$arrVnfds[$i]['password'] = $str;
									}
								}
							}
						}
					}
				}
				else{
					$arrVnfds[$i][$key] = $value;
				}
			}
		}
	}


	$ch = curl_init(API_MANO_BASE.GET_VIMS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	$decoded_json = json_decode($res, true);
	
	$arrVims = [];
	$needed_vim_params = ["_id","name","vim_url","resources","vim_tenant_name", "vim_type"];
	
	for($i = 0; $i < count($decoded_json); $i++){
		foreach($decoded_json[$i] as $key=>$value){
			if(in_array($key, $needed_vim_params)){
				$arrVims[$i][$key] = $value;
			}
		}
	}


	$ch = curl_init(API_MANO_BASE.GET_RUNNING_INSTANCES);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	$decoded_json_nss = json_decode($res, true);
	
	for($i = 0; $i < count($decoded_json_nss); $i++){
		foreach($decoded_json_nss[$i] as $key=>$value){
			if($key == "datacenter"){
				for($y = 0; $y < count($arrVims); $y++){
					foreach($arrVims[$y] as $k=>$v){
						if(($k == '_id') && $v == $value){
							
								$decoded_json_nss[$i]["datacenter_name"] = $arrVims[$y]["name"];
								$decoded_json_nss[$i]["vim_resources"] = $arrVims[$y]["resources"];
								$decoded_json_nss[$i]["vim_url"] = $arrVims[$y]["vim_url"];
								$decoded_json_nss[$i]["vim_tenant"] = $arrVims[$y]["vim_tenant_name"];
								$decoded_json_nss[$i]["vim_type"] = $arrVims[$y]["vim_type"];
						}
					}
				}
			}
			else if($key ==  "vnfd-id"){
				
				for($j = 0; $j < count($decoded_json_nss[$i][$key]); $j++){
					$arrNS = [];
					$curr_vnfd_id = $decoded_json_nss[$i][$key][$j];
						for($k = 0; $k < count($arrVnfds); $k++){
								
								if($curr_vnfd_id == $arrVnfds[$k]["_id"]){
									
									$arrNS["_id"] = $curr_vnfd_id;
									if(array_key_exists("password", $arrVnfds[$k])){
										$arrNS["password"] = $arrVnfds[$k]["password"];
									}									
									$decoded_json_nss[$i][$key][$j] = $arrNS;
								}
							
						}
				}
			}
		}		
	}
		
	$json_out = json_encode($decoded_json_nss);
	print_r($json_out);

}





function getVims()
{
	$token = $_REQUEST['token'];

	$ch = curl_init(API_MANO_BASE.GET_VIMS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token,
	'Content-Length: '.mb_strlen($data)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	#print_r($res);
	echo $res;
}




function getInstances()
{
	$token = $_REQUEST['token'];

	$ch = curl_init(API_MANO_BASE.GET_RUNNING_INSTANCES);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token,
	'Content-Length: '.mb_strlen($data)));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	#print_r($res);
	echo $res;
}


function postAuth()
{
	$user = $_REQUEST['username'];
	$pass = $_REQUEST['pass'];
	
	$data = <<<EEE
{
"username": "$user",
"password": "$pass"
}
EEE;

	$ch = curl_init(API_MANO_BASE.POST_TAKE_TOKEN);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Content-Length: '.mb_strlen($data)));
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	#print_r($res);
	echo $res;
}


function writeLog($textLog)
{
		$filename = __DIR__."/logs.log";
		$fd = fopen($filename, "a");
		fwrite($fd, $textLog."\n");
		fclose($fd);
}
?>

