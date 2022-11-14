<?php

define('API_MANO_BASE','http://10.0.69.115/osm');
define('POST_TAKE_TOKEN','/admin/v1/tokens');
define('GET_RUNNING_INSTANCES','/nslcm/v1/ns_instances');
define('GET_VIMS','/admin/v1/vim_accounts');
define('POST_VNFD','/vnfpkgm/v1/vnf_packages_content');
define('POST_NSD','/nsd/v1/ns_descriptors_content');
define('POST_NS','/nslcm/v1/ns_instances_content');
define('DELETE_NS','/nslcm/v1/ns_instances_content/');
//

 if(!empty($_REQUEST)){
	if(function_exists($_REQUEST['action']))
	{
	  call_user_func($_REQUEST['action']);
	}
	die();
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

	$vnfd_name = $name.'_vnf';
    $vnfd = getVNFd($vnfd_name, $image, $ram, $vcpu, $storage);

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

	$ch = curl_init(API_MANO_BASE.GET_VIMS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);
	#print_r($res);
	$decoded_json = json_decode($res, true);
	//print_r( $decoded_json);
	
	$arrVims = [];
	$needed_vim_params = ["_id","name","vim_url","resources"];
	
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
	#print_r($res);
	//echo $res;
	$decoded_json_nss = json_decode($res, true);
	
	for($i = 0; $i < count($decoded_json_nss); $i++){
		foreach($decoded_json_nss[$i] as $key=>$value){
			if($key == "datacenter"){
				for($y = 0; $y < count($arrVims); $y++){
					foreach($arrVims[$y] as $k=>$v){
						if(($k == '_id') && $v == $value){
							
								$decoded_json_nss[$i]["datacenter_name"] = $arrVims[$y]["name"];

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

