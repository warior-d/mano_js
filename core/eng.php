<?php

define('API_MANO_BASE','http://10.0.69.115/osm');
define('POST_TAKE_TOKEN','/admin/v1/tokens');
define('GET_RUNNING_INSTANCES','/nslcm/v1/ns_instances');
define('GET_VIMS','/admin/v1/vim_accounts');
define('POST_VNFD','/vnfpkgm/v1/vnf_packages_content');
define('POST_NSD','/nsd/v1/ns_descriptors_content');
define('POST_NS','/nslcm/v1/ns_instances_content');
define('DELETE_NS','/nslcm/v1/ns_instances_content/');


getInstancesAndVims();

function getInstancesAndVims()
{
	$token = 'hDtUt7dx5kYZ9M3rMKi2Nw4B44fkWVBE';

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
	
	//print_r($arrVims);


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
	print_r(count($decoded_json_nss));
	//print_r($decoded_json_nss);
	
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



?>

