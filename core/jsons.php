<?php

function getVNFdWSDB($name, $imageWS, $imageDB, $ramWS, $vcpuWS, $storageWS, $ramDB, $vcpuDB, $storageDB){

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
						"id": "cpu_util_ws",
						"name": "vnf_cpu_util_ws",
						"performance-metric": "cpu_utilization"
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
						"id": "cpu_util_db",
						"name": "vnf_cpu_util_db",
						"performance-metric": "cpu_utilization"
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


function getNSdWSDB($name, $vnf_name, $network, $ipDB){

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
						"id": "manage_ws",
						"mgmt-network": true,
						"vim-network-name": "$network"
					},
					{
						"id": "manage_db",
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
												"constituent-cpd-id": "ext_ws_vm"
											}
										],
										"virtual-link-profile-id": "manage_ws"
									},
									{
										"constituent-cpd-id": [
											{
												"constituent-base-element-id": "1",
												"constituent-cpd-id": "ext_db_vm",
												"ip-address": "$ipDB"
											}
										],
										"virtual-link-profile-id": "manage_db"
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







































function getVNFd($name, $image, $ram, $vcpu, $storage){

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
			"supplemental-boot-data": {
				"boot-data-drive": "true"
			},
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