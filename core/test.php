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



$a = getInstancesAndVims("LkxAJRv6gDFEd9pI8ca2ioNcLOYHFhYS");
print_r($a);


function getInstancesAndVims($token)
{



	$ch = curl_init(API_MANO_BASE.GET_VNFDS);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8',
	'Accept: application/json; charset=utf-8', 'Connection: keep-alive', 'Authorization: Bearer '.$token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res_vnfd = curl_exec($ch);
	curl_close($ch);
	#print_r($res_vnfd);
	$decoded_json_vnfd = json_decode($res_vnfd, true);
	#print_r($decoded_json_vnfd);
	
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
	#print_r($res);
	$decoded_json = json_decode($res, true);
	#print_r( $decoded_json);
	
	$arrVims = [];
	$needed_vim_params = ["_id","name","vim_url","resources","vim_tenant_name"];
	
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
						}
					}
				}
			}
			else if($key ==  "vnfd-id"){
				
				for($j = 0; $j < count($decoded_json_nss[$i][$key]); $j++){
					$arrNS = [];
					$curr_vnfd_id = $decoded_json_nss[$i][$key][$j];
					print_r($curr_vnfd_id);
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
	print_r($decoded_json_nss);

}



?>