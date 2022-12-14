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




$a = getOpenstackNetworks();





function getOpenstackNetworks()
{
	
	include "jsons.php";
	
	$api_openstack = 'http://10.0.69.114/identity/v3';
	$openstack_user = 'admin';
	$openstack_pass = 'devstack';
	$openstack_tenant = 'admin';
	
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
	$neutron_api_url = '';
	
	for($i = 0; $i < count($response_array['token']['catalog']); $i++){
		
		$inner_arr = $response_array['token']['catalog'][$i];
		
		if($inner_arr['type'] == 'network'){
			$neutron_api_url = $inner_arr['endpoints']['0']['url'];
		}
		
	}
	
	$url_get_nets = $neutron_api_url.'/v2.0/networks';

	$ch = curl_init($url_get_nets);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
	'X-Auth-Token: '.$x_token));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
	$res = curl_exec($ch);
	curl_close($ch);

	$decoded_json_nets = json_decode($res, true);
	$nets = $decoded_json_nets['networks'];
	$new_obj = [];

	for($i = 0; $i < count($nets); $i++){
		foreach($nets[$i] as $key=>$value){
			if($key == 'name'){
				array_push($new_obj, $value);
			}
		}
	}
	
    echo json_encode($new_obj);	
}



?>