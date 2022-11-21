<?php


function getEDGE($name, $url_edge, $tenant_name, $user_edge, $pass_edge){
	
$edge = 
<<<EDGE
{
  "name": "$name",
  "vim_type": "openstack",
  "vim_url": "$url_edge",
  "vim_tenant_name": "$tenant_name",
  "vim_user": "$user_edge",
  "vim_password": "$pass_edge",
  "config": {
    "security_groups": "default"
  }
}
EDGE;
	
return $edge;
}




function getVNFdInternet($name, $cloud_config){

//	$cloud_config = '';

$newVNFd = 
<<<VNFd
{
	"vnfd": {
		"id": "$name",
		"version": 1,
		"description": "S$name",
		"mgmt-cp": "vnf-mgmt-ext",
		"product-name": "$name",
		"sw-image-desc": [
			{
				"id": "vyos-1.4-202209181303",
				"image": "vyos-1.4-202209181303",
				"name": "vyos-1.4-202209181303"
			},
			{
				"id": "vyos-1.4-202207220921",
				"image": "vyos-1.4-202207220921",
				"name": "vyos-1.4-202207220921"
			}
		],
		"df": [
			{
				"id": "default-df",
				"instantiation-level": [
					{
						"id": "default-instantiation-level",
						"vdu-level": [
							{
								"number-of-instances": 1,
								"vdu-id": "vyos-VM"
							}
						]
					}
				],
				"vdu-profile": [
					{
						"id": "vyos-VM",
						"min-number-of-instances": 1,
						"max-number-of-instances": 1
					}
				]
			}
		],
		"ext-cpd": [
			{
				"id": "vnf-mgmt-ext",
				"int-cpd": {
					"cpd": "vdu-eth0-int",
					"vdu-id": "vyos-VM"
				}
			},
			{
				"id": "vnf-internal-ext",
				"int-cpd": {
					"cpd": "vdu-eth1-int",
					"vdu-id": "vyos-VM"
				},
				"port-security-enabled": false,
				"port-security-disable-strategy": "allow-address-pairs"
			}
		],
		"vdu": [
			{
				"id": "vyos-VM",
				"name": "vyos-VM",
				"supplemental-boot-data": {
					"boot-data-drive": "true"
				},
				"sw-image-desc": "vyos-1.4-202209181303",
				"cloud-init": $cloud_config,
				"int-cpd": [
					{
						"id": "vdu-eth0-int",
						"virtual-network-interface-requirement": [
							{
								"name": "vdu-eth0",
								"position": 0,
								"virtual-interface": {
									"type": "PARAVIRT"
								}
							}
						]
					},
					{
						"id": "vdu-eth1-int",
						"virtual-network-interface-requirement": [
							{
								"name": "vdu-eth1",
								"position": 1,
								"virtual-interface": {
									"type": "PARAVIRT"
								}
							}
						]
					}
				],
				"monitoring-parameter": [
					{
						"id": "vyos_cpu_util",
						"name": "vyos_cpu_util",
						"performance-metric": "cpu_utilization"
					},
					{
						"id": "vyos_memory_util",
						"name": "vyos_memory_util",
						"performance-metric": "average_memory_utilization"
					},
					{
						"id": "vyos_packets_sent",
						"name": "vyos_packets_sent",
						"performance-metric": "packets_sent"
					},
					{
						"id": "vyos_packets_received",
						"name": "vyos_packets_received",
						"performance-metric": "packets_received"
					},
					{
						"id": "vyos_packets_in_dropped",
						"name": "vyos_packets_in_dropped",
						"performance-metric": "packets_in_dropped"
					},
					{
						"id": "vyos_packets_ous_dropped",
						"name": "vyos_packets_out_dropped",
						"performance-metric": "packets_in_dropped"
					}
				],
				"virtual-compute-desc": "vyos-VM-compute",
				"virtual-storage-desc": [
					"vyos-VM-storage"
				]
			}
		],
		"virtual-compute-desc": [
			{
				"id": "vyos-VM-compute",
				"virtual-cpu": {
					"num-virtual-cpu": 1
				},
				"virtual-memory": {
					"size": 2
				}
			}
		],
		"virtual-storage-desc": [
			{
				"id": "vyos-VM-storage",
				"size-of-storage": 10
			}
		]
	}
}
VNFd;

return $newVNFd;

}



function getNSdInternet($nsd_name, $vnfd_name, $internalNetwork, $externalNetwork){
$nsd = 
<<<NSD
{
	"nsd": {
		"nsd": [
			{
				"description": "Single VyOS NS",
				"id": "$nsd_name",
				"name": "$nsd_name",
				"version": 1,
				"vnfd-id": [
					"$vnfd_name"
				],
				"df": [
					{
						"id": "default-df",
						"vnf-profile": [
							{
								"id": "vyos-1",
								"virtual-link-connectivity": [
									{
										"constituent-cpd-id": [
											{
												"constituent-base-element-id": "vyos-1",
												"constituent-cpd-id": "vnf-mgmt-ext"
											}
										],
										"virtual-link-profile-id": "public"
									},
									{
										"constituent-cpd-id": [
											{
												"constituent-base-element-id": "vyos-1",
												"constituent-cpd-id": "vnf-internal-ext",
												"ip-address": "192.168.0.1"
											}
										],
										"virtual-link-profile-id": "internal"
									}
								],
								"vnfd-id": "$vnfd_name"
							}
						]
					}
				],
				"virtual-link-desc": [
					{
						"id": "public",
						"vim-network-name": "$externalNetwork",
						"mgmt-network": true
					},
					{
						"id": "internal",
						"vim-network-name": "$internalNetwork"
					}
				]
			}
		]
	}
}
NSD;

return $nsd;

}


function getNetServinternet($instance_name, $instance_description, $ns_id, $vim_id){


$newNS = 
<<<NS
{
  "nsName": "$instance_name",
  "nsDescription": "$instance_description",
  "nsdId": "$ns_id",
  "vimAccountId": "$vim_id"
}
NS;

return $newNS;
}








function getOS(){
	
$osJS = 
<<<FFF
{
  "remote_console": {
    "protocol": "vnc",
    "type": "novnc"
  }
}	
FFF;
return $osJS;
}



function getOStoken($os_user, $os_pass, $os_tenant){

$newDATA = 
<<<DATA
{ "auth": {
    "identity": {
      "methods": ["password"],
      "password": {
        "user": {
          "name": "$os_user",
          "domain": { "id": "default" },
          "password": "$os_pass"
        }
      }
    },
    "scope": {
      "project": {
        "name": "$os_tenant",
        "domain": { "id": "default" }
      }
    }
  }
}
DATA;
return $newDATA;
}


function getVNFdWSDB($name, $imageWS, $imageDB, $ramWS, $vcpuWS, $storageWS, $ramDB, $vcpuDB, $storageDB, $ipDB, $cloud_config){

//$cloud_config = "";

$newVNFd = 
<<<VNFd
{
	"vnfd": {
		"id": "$name",
		"description": "$name",
		"product-name": "$name",
		"provider": "MTS",
		"version": "1.0",
		"df": [
			{
				"id": "default_df",
				"instantiation-level": [
					{
						"id": "default_instantiation_level",
						"vdu-level": [
							{
								"number-of-instances": 1,
								"vdu-id": "ws_vm"
							},
							{
								"number-of-instances": 1,
								"vdu-id": "db_vm"
							}
						]
					}
				],
				"vdu-profile": [
					{
						"id": "ws_vm",
						"min-number-of-instances": 1
					},
					{
						"id": "db_vm",
						"min-number-of-instances": 1
					}
				]
			}
		],
		"ext-cpd": [
			{
				"id": "ext_ws_vm",
				"int-cpd": {
					"cpd": "int_ws_vm",
					"vdu-id": "ws_vm"
				}
			},
			{
				"id": "ext_db_vm",
				"int-cpd": {
					"cpd": "int_db_vm",
					"vdu-id": "db_vm"
				}
			}
		],
		"sw-image-desc": [
			{
				"id": "base_ubuntu_18",
				"image": "Ubuntu 18.04",
				"name": "Ubuntu 18.04"
			},
			{
				"id": "ws_image",
				"image": "$imageWS",
				"name": "$imageWS"
			},
			{
				"id": "db_image",
				"image": "$imageDB",
				"name": "$imageDB"
			}
		],
		"mgmt-cp": "ext_ws_vm",
		"vdu": [
			{
				"id": "ws_vm",
				"cloud-init": $cloud_config,
				"int-cpd": [
					{
						"id": "int_ws_vm",
						"virtual-network-interface-requirement": [
							{
								"name": "ws_vm_network",
								"virtual-interface": {
									"type": "PARAVIRT"
								}
							}
						]
					}
				],
				"name": "ws_vm",
				"sw-image-desc": "ws_image",
				"virtual-compute-desc": "compute_vm_ws",
				"virtual-storage-desc": "storage_vm_ws",
				"monitoring-parameter": [
					{
						"id": "packets_sent_ws",
						"name": "vnf_packets_sent_ws",
						"performance-metric": "packets_sent"
					},
					{
						"id": "packets_received_ws",
						"name": "vnf_packets_received_ws",
						"performance-metric": "packets_received"
					},
					{
						"id": "mem_util_ws",
						"name": "vnf_mem_util_ws",
						"performance-metric": "average_memory_utilization"
					}
				]
			},
			{
				"id": "db_vm",
				"int-cpd": [
					{
						"id": "int_db_vm",
						"virtual-network-interface-requirement": [
							{
								"name": "db_vm_network",
								"virtual-interface": {
									"type": "PARAVIRT"
								}
							}
						]
					}
				],
				"name": "db_vm",
				"sw-image-desc": "db_image",
				"virtual-compute-desc": "compute_vm_db",
				"virtual-storage-desc": "storage_vm_db",
				"monitoring-parameter": [
					{
						"id": "packets_sent_db",
						"name": "vnf_packets_sent_db",
						"performance-metric": "packets_sent"
					},
					{
						"id": "packets_received_db",
						"name": "vnf_packets_received_db",
						"performance-metric": "packets_received"
					},
					{
						"id": "mem_util_db",
						"name": "vnf_mem_util_db",
						"performance-metric": "average_memory_utilization"
					}
				]
			}
		],
		"virtual-compute-desc": [
			{
				"id": "compute_vm_ws",
				"virtual-cpu": {
					"num-virtual-cpu": "$vcpuWS"
				},
				"virtual-memory": {
					"size": "$ramWS"
				}
			},
			{
				"id": "compute_vm_db",
				"virtual-cpu": {
					"num-virtual-cpu": "$vcpuDB"
				},
				"virtual-memory": {
					"size": "$ramDB"
				}
			}
		],
		"virtual-storage-desc": [
			{
				"id": "storage_vm_ws",
				"size-of-storage": "$storageWS"
			},
			{
				"id": "storage_vm_db",
				"size-of-storage": "$storageDB"
			}
		]
	}
}
VNFd;

return $newVNFd;

}


function getNSdWSDB($name, $vnf_name, $network, $ipDB, $ipWS){

//	$cloud_config = '';

$newNSd = 
<<<NSd
{
	"nsd": {
		"nsd": [
			{
				"id": "$name",
				"description": "$name",
				"designer": "MTS",
				"version": "1.0",
				"name": "$name",
				"virtual-link-desc": [
					{
						"id": "manage_db",
						"mgmt-network": true,
						"vim-network-name": "$network"
					},
					{
						"id": "manage_ws",
						"mgmt-network": true,
						"vim-network-name": "$network"
					}
				],
				"vnfd-id": [
					"$vnf_name"
				],
				"df": [
					{
						"id": "default-df",
						"vnf-profile": [
							{
								"id": "1",
								"virtual-link-connectivity": [
									{
										"constituent-cpd-id": [
											{
												"constituent-base-element-id": "1",
												"constituent-cpd-id": "ext_db_vm",
												"ip-address": "$ipDB"
											}
										],
										"virtual-link-profile-id": "manage_db"
									},
									{
										"constituent-cpd-id": [
											{
												"constituent-base-element-id": "1",
												"constituent-cpd-id": "ext_ws_vm",
												"ip-address": "$ipWS"
											}
										],
										"virtual-link-profile-id": "manage_ws"
									}
								],
								"vnfd-id": "$vnf_name"
							}
						]
					}
				]
			}
		]
	}
}
NSd;

return $newNSd;

}


function getNetServWSDB($instance_name, $instance_description, $ns_id, $vim_id){


$newNS = 
<<<NS
{
  "nsName": "$instance_name",
  "nsDescription": "$instance_description",
  "nsdId": "$ns_id",
  "vimAccountId": "$vim_id"
}
NS;

return $newNS;
}






function getVNFd($name, $image, $ram, $vcpu, $storage, $cloud_config){

//	$cloud_config = '';

$newVNFd = 
<<<VNFd
{
	"vnfd": {
		"id": "$name",
		"description": "$name",
		"product-name": "$name",
		"provider": "MTS",
		"version": "1.0",
		"df": [
		  {
			"id": "default_df",
			"instantiation-level": [
			  {
				"id": "default_instantiation_level",
				"vdu-level": [
				  {
					"number-of-instances": 1,
					"vdu-id": "ubuntu_VM"
				  }
				]
			  }
			],
			"vdu-profile": [
			  {
				"id": "ubuntu_VM",
				"min-number-of-instances": 1
			  }
			]
		  }
		],
		"ext-cpd": [
		  {
			"id": "ext_ubuntu_VM",
			"int-cpd": {
			  "cpd": "int_ubuntu_VM",
			  "vdu-id": "ubuntu_VM"
			}
		  }
		],
		"sw-image-desc": [
		  {
			"id": "$image",
			"image": "$image",
			"name": "$image"
		  }
		],
		"mgmt-cp": "ext_ubuntu_VM",
		"vdu": [
		  {
			"id": "ubuntu_VM",
			"cloud-init": $cloud_config,
			"int-cpd": [
			  {
				"id": "int_ubuntu_VM",
				"virtual-network-interface-requirement": [
				  {
					"name": "ubuntu_VM_network",
					"virtual-interface": {
					  "type": "PARAVIRT"
					}
				  }
				]
			  }
			],
			"name": "ubuntu_VM",
			"sw-image-desc": "$image",
			"virtual-compute-desc": "ubuntu_VM_compute",
			"virtual-storage-desc": [
			  "ubuntu_VM_storage"
			],
			"monitoring-parameter": [
			  {
				"id": "cpu_util",
				"name": "vnf_cpu_util",
				"performance-metric": "cpu_utilization"
			  },
			  {
				"id": "mem_util",
				"name": "vnf_mem_util",
				"performance-metric": "average_memory_utilization"
			  },
			  {
				"id": "pack_sent",
				"name": "vnf_pack_sent",
				"performance-metric": "packets_sent"
			  },
			  {
				"id": "pack_receive",
				"name": "vnf_pack_receive",
				"performance-metric": "packets_received"
			  }
			]
		  }
		],
		"virtual-compute-desc": [
		  {
			"id": "ubuntu_VM_compute",
			"virtual-cpu": {
			  "num-virtual-cpu": "$vcpu"
			},
			"virtual-memory": {
			  "size": "$ram"
			}
		  }
		],
		"virtual-storage-desc": [
		  {
			"id": "ubuntu_VM_storage",
			"size-of-storage": "$storage"
		  }
		]
	}
}
VNFd;

return $newVNFd;

}


####################################################### NSd


function getNSd($name, $vnf_name, $network){

//	$cloud_config = '';

$newNSd = 
<<<NSd
{
  "nsd": {
    "nsd": [
      {
        "id": "$name",
        "description": "$name",
        "designer": "MTS",
        "version": "1.0",
        "name": "$name",
        "virtual-link-desc": [
          {
            "id": "$network",
            "mgmt-network": "true",
            "vim-network-name": "$network"
          }
        ],
        "vnfd-id": [
          "$vnf_name"
        ],
        "df": [
          {
            "id": "default-df",
            "vnf-profile": [
              {
                "id": "1",
                "virtual-link-connectivity": [
                  {
                    "constituent-cpd-id": [
                      {
                        "constituent-base-element-id": "1",
                        "constituent-cpd-id": "ext_ubuntu_VM"
                      }
                    ],
                    "virtual-link-profile-id": "$network"
                  }
                ],
                "vnfd-id": "$vnf_name"
              }
            ]
          }
        ]
      }
    ]
  }
}
NSd;

return $newNSd;

}




####################################################### INSTANCE


function getNetServ($instance_name, $instance_description, $ns_id, $vim_id){

//	$cloud_config = '';

$newNS = 
<<<NS
{
  "nsName": "$instance_name",
  "nsDescription": "$instance_description",
  "nsdId": "$ns_id",
  "vimAccountId": "$vim_id"
}
NS;

return $newNS;

}









?>