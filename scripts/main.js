//17.12.2019
$(document).ready(function(){
	
	var mainDiv = document.getElementById("main_div");
	// сначала - извлечем токен из localStorage!
	var token = localStorage.getItem('MANOtokenID');
	//console.log(token);
	
	if(token == null || token == undefined || token == ''){
		
		console.log('get out. NOW');
		getOut();
		
	}
	else{

	$.ajax({
	type:"POST",
	url: "./core/engine.php",
	dataType: "json",
	data: {
		action: "getTokenInfo",
		token: token
		},
	success: function(data) 
		{
			
			let flag_fail = false;
			


				for(key in data){
					if(key == 'code' && data[key] == 'UNAUTHORIZED'){
						console.log("change");
						flag_fail = true;
					}
				}


			if(flag_fail){
				console.log('get out. LATE');
				getOut();	
			}
			else{
				// Заполним инстансы, если есть!
				getInstances(token);


				//по-умолчанию мы показывает Ресурсы!
				var p_road = document.getElementById("roadMap");
				var p_place = document.getElementById("placeMap");
				
				p_road.innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
				p_place.innerHTML = 'Мои сервисы';


				//создать compute
				$("#div_compute").click(function() {
					
					createCompute(token);
					
				});	
				
				//создать ws
				$("#div_ws").click(function() {
					
					createWSandDBaaS(token);

				});	

				//создать dbas
				$("#div_internet").click(function() {
					
					createInternet(token);

				});	
				
				
				$("#div_dashboard").click(function() {
					
					getInstances(token);
					
				});	

				$("#div_edge").click(function() {
					
					createEDGE(token);
					
				});
	
				
			}
			
			
		}
	});
	}
	

});

function getOut(){
	
	localStorage.setItem('MANOtokenID', '');
	
	alert(' Токен не валиден. Вы будете перенаправлены на страницу логина! ');
	
	window.open('http://10.0.69.118/login.php', '_self', false);
	
}


//############################       EDGE


function createEDGE(token){
	
	var mainDiv = document.getElementById("main_div");
	mainDiv.innerHTML = '';
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Менеджмент EDGE';
	document.getElementById("placeMap").innerHTML = 'Создание EDGE';
	
	var services = new Object();
	services = {
		"name": "Имя EDGE",
		"vim_url": "URL аутентификации VIM",
		"vim_tenant_name": "Имя tenant",
		"vim_user": "Имя пользователя VIM",
		"vim_password": "Пароль VIM",
		"vim_type": "Тип VIM",
	};
	
	generateDivEDGE("main_div", services, token);
}

function generateDivEDGE(div_id, head, token)
{
	let parentElem = document.getElementById(div_id);
	
			let _p = document.createElement('p');
			_p.innerHTML = "Создание нового EDGE";
			_p.classList.add('headerMainDiv');
			parentElem.appendChild(_p);
			
			var col = 1;
			var row = Object.keys(head).length*2;
			let _tbl = document.createElement('table'); //table +
			_tbl.setAttribute('border', '0');
			_tbl.setAttribute('width', '45%');
			for(let i = 0; i < col; i++){
				for(let y = 0; y < row; y++){
					let _tr = document.createElement('tr');
					
					let _td = document.createElement('td');
					_td.id = 'TD_INTERNET_'+y;
					
					//раскидаем titles сразу.
					if(y%2 == 0){
						let num = y/2;
						let title = '';
						let i = 0;
						for(key in head){
							if(i == num){
								let _p = document.createElement('p');
								_p.id = 'P_EDGE_'+y;
								_p.innerHTML = head[key];
								_p.classList.add('computeTableP');
								_td.appendChild(_p);
							}
							i++;
						}
					}
					else{
						let _div = document.createElement('div');
						_div.id = 'DIV_EDGE_'+y;
						_td.appendChild(_div)
					}
					_tr.appendChild(_td);
					_tbl.appendChild(_tr);
				}
			}
			parentElem.appendChild(_tbl);


			let name_div1 = document.getElementById('DIV_EDGE_1');
			let name_input = document.createElement('input');
			name_input.id = 'input_name_edge';
			name_input.classList.add('inputName');
			name_div1.appendChild(name_input);

			let name_div2 = document.getElementById('DIV_EDGE_3');
			let name_input2 = document.createElement('input');
			name_input2.id = 'input_url_edge';
			name_input2.classList.add('inputName');
			name_div2.appendChild(name_input2);
			
			let name_div3 = document.getElementById('DIV_EDGE_5');
			let name_input3 = document.createElement('input');
			name_input3.id = 'input_tenant_edge';
			name_input3.classList.add('inputName');
			name_div3.appendChild(name_input3);			

			let name_div4 = document.getElementById('DIV_EDGE_7');
			let name_input4 = document.createElement('input');
			name_input4.id = 'input_user_edge';
			name_input4.classList.add('inputName');
			name_div4.appendChild(name_input4);		

			let name_div5 = document.getElementById('DIV_EDGE_9');
			let name_input5 = document.createElement('input');
			name_input5.id = 'input_passw_edge';
			name_input5.classList.add('inputName');
			name_input5.setAttribute('type', 'password');
			name_div5.appendChild(name_input5);	

			let name_div6 = document.getElementById('DIV_EDGE_11');
			let select_vim_type = document.createElement('select');
			select_vim_type.id = 'select_vim_type';
			select_vim_type.classList.add('selectStyle');
			let option_vim_type = document.createElement('option');
			option_vim_type.innerHTML = 'openstack';
			let option_vim_type2 = document.createElement('option');
			option_vim_type2.innerHTML = 'k8s';
			select_vim_type.appendChild(option_vim_type);
			select_vim_type.appendChild(option_vim_type2);
			name_div6.appendChild(select_vim_type);	

			
			$("#input_name_internet").keyup(function(data)
			{
				var curStr = $('#input_name_internet').val();
				if(curStr.trim() !=  curStr)
				{
					document.getElementById("input_name_internet").value = curStr.trim();
				}
			});


			let _butt_exec = document.createElement('button');
			_butt_exec.id = 'execute_button_edge';
			_butt_exec.innerHTML = 'Создать';
			_butt_exec.classList.add('forbuttonExec');
			parentElem.appendChild(_butt_exec);



			
			$("#execute_button_edge").click(function() {
				
				let instanceName = $('#input_name_edge').val();

				let url_edge = $('#input_url_edge').val();
				
				let tenant_name =  $('#input_tenant_edge').val();

				let user_edge = $('#input_user_edge').val();
				
				let pass_edge = $('#input_passw_edge').val();
				

			
				
				
				if(instanceName != '' && url_edge != '' && tenant_name != ''  && user_edge != '' && pass_edge != ''){
					
					$.ajax({
						type:"POST",
						url: "./core/engine.php",
						dataType: "json",
						data: {
							action: "createEDGE",
							name: instanceName,
							url_edge: url_edge,
							tenant_name: tenant_name,
							user_edge: user_edge,
							pass_edge: pass_edge,
							token: token
							},
						success: function(data) 
							{
								console.log(data);
								getInstances(token);
							}
					});
				}
				else{
					alert(" Введены не все данные ");
				}				
			});

			
			

			
}



//############################       Internet


function createInternet(token){
	
	var mainDiv = document.getElementById("main_div");
	mainDiv.innerHTML = '';
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Создание сервиса';
	document.getElementById("placeMap").innerHTML = 'Создание сервиса';
	
	var services = new Object();
	services = {
		"name": "Имя сервиса",
		"internal_network": "Внутренняя сеть",
		"external_network": "Внешняя сеть",
		"VIM": "Сайт EDGE"
	};
	
	generateDivInternet("main_div", services, token);
}


function generateDivInternet(div_id, head, token)
{

	var vims = new Array();
	var needParams = ["vim_url", "name", "vim_type", "_id"];
	

	$.ajax({
	type:"POST",
	url: "./core/engine.php",
	dataType: "json",
	data: {
		action: "getVims",
		token: token
		},
	success: function(data) 
		{

			if(data.length>=1){
				for(let i=0; i < data.length;i++){
					
					var arr = {};
					for(key in data[i]){
						if(needParams.indexOf(key) != -1){
							arr[key] = data[i][key];
						}
					}
					vims[i] = arr;
				}
			}
			else{
				console.log("getVIMS error!!!");
			}
			
			let parentElem = document.getElementById(div_id);			
			console.log(vims);

			let _p = document.createElement('p');
			_p.innerHTML = "Создание сервиса Internet";
			_p.classList.add('headerMainDiv');
			parentElem.appendChild(_p);


			var col = 1;
			var row = Object.keys(head).length*2;
			let _tbl = document.createElement('table'); //table +
			_tbl.setAttribute('border', '0');
			_tbl.setAttribute('width', '45%');
			for(let i = 0; i < col; i++){
				for(let y = 0; y < row; y++){
					let _tr = document.createElement('tr');
					
					let _td = document.createElement('td');
					_td.id = 'TD_INTERNET_'+y;
					
					//раскидаем titles сразу.
					if(y%2 == 0){
						let num = y/2;
						let title = '';
						let i = 0;
						for(key in head){
							if(i == num){
								let _p = document.createElement('p');
								_p.id = 'P_INTERNET_'+y;
								_p.innerHTML = head[key];
								_p.classList.add('computeTableP');
								_td.appendChild(_p);
							}
							i++;
						}
					}
					else{
						let _div = document.createElement('div');
						_div.id = 'DIV_INT_'+y;
						_td.appendChild(_div)
					}
					_tr.appendChild(_td);
					_tbl.appendChild(_tr);
				}
			}
			parentElem.appendChild(_tbl);
			

			let name_div1 = document.getElementById('DIV_INT_1');
			let name_input = document.createElement('input');
			name_input.id = 'input_name_internet';
			name_input.classList.add('inputName');
			name_div1.appendChild(name_input);
			
			let name_div3 = document.getElementById('DIV_INT_3');
			let select_int_network = document.createElement('select');
			select_int_network.id = 'select_int_network';
			select_int_network.classList.add('selectStyle');
			let option_int_netw = document.createElement('option');
			option_int_netw.innerHTML = 'internal';
			select_int_network.appendChild(option_int_netw);
			name_div3.appendChild(select_int_network);

			let name_div5 = document.getElementById('DIV_INT_5');
			let select_ext_network = document.createElement('select');
			select_ext_network.id = 'select_ext_network';
			select_ext_network.classList.add('selectStyle');
			let ortion_ext_network = document.createElement('option');
			ortion_ext_network.innerHTML = 'external';
			select_ext_network.appendChild(ortion_ext_network);
			name_div5.appendChild(select_ext_network);	

			let name_div7 = document.getElementById('DIV_INT_7');
			let _select_vim = document.createElement('select');
			_select_vim.id = 'select_vim_internet';
			_select_vim.classList.add('selectStyle');
			
			for(let i=0; i < vims.length; i++){

				if(vims[i]["vim_type"] != "openstack"){
					continue;
				}
				else{

					for(key in vims[i]){
						if(key == 'name'){
							let _option = document.createElement('option');
							_option.id = 'OPT_INT_' + vims[i][key];
						_option.innerHTML = vims[i][key]; // + '(' + vims[i]['vim_url'] + ')'
							_select_vim.appendChild(_option);
						}
					}
					name_div7.appendChild(_select_vim);	
				}
			}
		
		
			$("#input_name_internet").keyup(function(data)
			{
				var curStr = $('#input_name_internet').val();
				if(curStr.trim() !=  curStr)
				{
					document.getElementById("input_name_internet").value = curStr.trim();
				}
			});

			let _butt_exec = document.createElement('button');
			_butt_exec.id = 'execute_button_internet';
			_butt_exec.innerHTML = 'Создать';
			_butt_exec.classList.add('forbuttonExec');
			parentElem.appendChild(_butt_exec);



			
			$("#execute_button_internet").click(function() {
				let instanceName = $('#input_name_internet').val();

				let internalNetwork = $('#select_int_network').val();
				
				let externalNetwork =  $('#select_ext_network').val();

				let vimName = $('#select_vim_internet').val();
				
				let vim_id = '';
				
				for(var i =0; i < vims.length; i++){
					
					if(vims[i]['name'] == vimName){
						vim_id = vims[i]['_id'];
					}
					
				}
				
				
				if(instanceName != ''){
					
					console.log(instanceName + '' + internalNetwork + '' + externalNetwork + '' + vimName);
					
										//////////////////////////////////////////// создадим VNFd
					$.ajax({
						type:"POST",
						url: "./core/engine.php",
						dataType: "json",
						data: {
							action: "createVNFDinternet",
							name: instanceName,
							token: token,
							internalNetwork: internalNetwork,
							externalNetwork: externalNetwork,
							vim: vim_id
							},
						success: function(data) 
							{
								console.log(data);
								
								if(data["code"] == "CONFLICT"){
									alert(" Сервис с указанным именем существует в текущем проекте! ");
								}
								else{
									///////////////////////////////// создадим NSd
									$.ajax({
										type:"POST",
										url: "./core/engine.php",
										dataType: "json",
										data: {
											action: "createNSDinternet",
											name: instanceName,
											token: token,
											internalNetwork: internalNetwork,
											externalNetwork: externalNetwork,
											vim: vim_id
											},
										success: function(data) 
											{
												console.log(data);
												let nsd_id = '';
												nsd_id = data['id'];
												

									///////////////////////////////// создадим NS !!!!!!!
												$.ajax({
													type:"POST",
													url: "./core/engine.php",
													dataType: "json",
													data: {
														action: "createNSinternet",
														name: instanceName,
														token: token,
														vim: vim_id,
														ns_id: nsd_id,
														instanceType: 'internet'
														},
													success: function(data) 
														{
															console.log(data);
															getInstances(token);
														}
												});

											}
									});
								
								}
								
							}
					});

				}
				else if(instanceName == ''){
					alert(" Не указано название сервиса! ");
				}				
				else if(resoursesWS == ''){
					alert(" Не выбраны ресурсы WS! ");
				}
				else if(resoursesDB == ''){
					alert(" Не выбраны ресурсы DB! ");
				}
			});




		}
		
});

}


//############################       WSDB


function createWSandDBaaS(token){
	var mainDiv = document.getElementById("main_div");
	mainDiv.innerHTML = '';
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Создание сервиса';
	document.getElementById("placeMap").innerHTML = 'Создание сервиса';
	
	var services = new Object();
	services = {
		"name": "Имя сервиса",
		"image_ws": "Образ операционной системы Веб-сервера",
		"ws_basket": "Шаблон ресурсов веб-сервера",
		"image_db": "Образ операционной системы БД",
		"db_basket": "Шаблон ресурсов базы данных",
		"network": "Сеть",
		"VIM": "Сайт EDGE",
	};
	
	generateDivWSDB("main_div", services, token);
	
}


function generateDivWSDB(div_id, head, token)
{
	
	var vims = new Array();
	var needParams = ["vim_url", "name", "vim_type", "_id"];
	
	$.ajax({
	type:"POST",
	url: "./core/engine.php",
	dataType: "json",
	data: {
		action: "getVims",
		token: token
		},
	success: function(data) 
		{
			//console.log(data);
			if(data.length>=1){
				for(let i=0; i < data.length;i++){
					
					
					
					var arr = {};
					for(key in data[i]){
						if(needParams.indexOf(key) != -1){
							arr[key] = data[i][key];
						}
					}
					vims[i] = arr;
				}
			}
			else{
				console.log("getVIMS error!!!");
			}
			
			console.log(vims);
			let parentElem = document.getElementById(div_id);


			let _p = document.createElement('p');
			_p.innerHTML = "Создание сервиса Web-server";
			_p.classList.add('headerMainDiv');
			parentElem.appendChild(_p);


			var col = 1;
			var row = Object.keys(head).length*2;
			let _tbl = document.createElement('table'); //table +
			_tbl.setAttribute('border', '0');
			_tbl.setAttribute('width', '45%');
			for(let i = 0; i < col; i++){
				for(let y = 0; y < row; y++){
					let _tr = document.createElement('tr');
					
					let _td = document.createElement('td');
					_td.id = 'TD_WS_'+y;
					
					//раскидаем titles сразу.
					if(y%2 == 0){
						let num = y/2;
						let title = '';
						let i = 0;
						for(key in head){
							if(i == num){
								let _p = document.createElement('p');
								_p.id = 'P_WS_'+y;
								_p.innerHTML = head[key];
								_p.classList.add('wsdbTableP');
								_td.appendChild(_p);
							}
							i++;
						}
					}
					else{
						let _div = document.createElement('div');
						_div.id = 'DIV_WS_'+y;
						_td.appendChild(_div)
					}
					_tr.appendChild(_td);
					_tbl.appendChild(_tr);
				}
			}
			parentElem.appendChild(_tbl);
			
			
			let name_div1 = document.getElementById('DIV_WS_1');
			let name_input = document.createElement('input');
			name_input.id = 'input_name_wsdb';
			name_input.classList.add('inputName');
			name_div1.appendChild(name_input);			
			
	
			
			let name_div3 = document.getElementById('DIV_WS_3');
			let select_image = document.createElement('select');
			select_image.id = 'select_image_ws';
			select_image.classList.add('selectStyle');
			let optionImageUbu18 = document.createElement('option');
			//let optionImageUbu20 = document.createElement('option');
			optionImageUbu18.innerHTML = 'Ubuntu 18.04.6-lts';
			//optionImageUbu20.innerHTML = 'Ubuntu 20.04';
			select_image.appendChild(optionImageUbu18);
			//select_image.appendChild(optionImageUbu20);
			name_div3.appendChild(select_image);		
		



let paramsWS = [{
  "SMALL": {
    "vCPU": "1 core",
    "RAM": "1 GB",
    "SSD": "5 GB"
  },
  "MEDIUM": {
    "vCPU": "2 core",
    "RAM": "2 GB",
    "SSD": "10 GB"
  },
  "LARGE": {
    "vCPU": "4 core",
    "RAM": "8 GB",
    "SSD": "15 GB"
  }
}];	

			let name_div5 = document.getElementById('DIV_WS_5');
			name_div5.classList.add('divBottomMargin');
			for(let i = 0; i < paramsWS.length; i++){

				let tbl_res = document.createElement('table');
				tbl_res.setAttribute('width','100%');
				let tbl_res_tr = document.createElement('tr');
				let qnt = 1;
				for(key in paramsWS[i]){
					
					let tbl_res_tr_td = document.createElement('td'); 
					let tbl_res_tr_td_div = document.createElement('div'); 
					tbl_res_tr_td_div.id = 'DIV_WS_RWS_' + qnt;
					tbl_res_tr_td_div.setAttribute('align', 'center');
					tbl_res_tr_td_div.classList.add('divResourseWS');
					let div_resDB_tbl = document.createElement('table');
					let key_arr_tr_hdr = document.createElement('tr');
					let key_arr_td_hdr = document.createElement('td');
					let key_arr_p_hdr = document.createElement('p');
						key_arr_p_hdr.classList.add('pWSdiv');
						key_arr_p_hdr.innerHTML = key;	
					key_arr_td_hdr.appendChild(key_arr_p_hdr);
					key_arr_tr_hdr.appendChild(key_arr_td_hdr);
					div_resDB_tbl.appendChild(key_arr_tr_hdr);
					qnt_in = 1;
					for(key_arr in paramsWS[i][key]){

						let key_arr_tr = document.createElement('tr');
						let key_arr_td = document.createElement('td');
						let key_arr_p = document.createElement('p');
						
							key_arr_p.classList.add('pWSdiv1');
							let p_txt = key_arr + " : " + paramsWS[i][key][key_arr];
							key_arr_p.innerHTML = p_txt;

						key_arr_td.appendChild(key_arr_p);
						key_arr_tr.appendChild(key_arr_td);
						
						div_resDB_tbl.appendChild(key_arr_tr);
						
						qnt_in = qnt_in + 1;
					}
					
					tbl_res_tr_td_div.appendChild(div_resDB_tbl);
					tbl_res_tr_td.appendChild(tbl_res_tr_td_div);
					tbl_res_tr.appendChild(tbl_res_tr_td);
					tbl_res.appendChild(tbl_res_tr);
					name_div5.appendChild(tbl_res);
					qnt = qnt + 1;
				}
			}

			let resoursesWS = '';
			$(document).on('click','div[id^="DIV_WS_RWS_"]', function(data)
				{
					document.getElementById("DIV_WS_RWS_1").classList.remove('divResourseWSclk');
					document.getElementById("DIV_WS_RWS_2").classList.remove('divResourseWSclk');
					document.getElementById("DIV_WS_RWS_3").classList.remove('divResourseWSclk');
						
					document.getElementById(this.id).classList.add('divResourseWSclk');
					resoursesWS = this.id;
				});	


			let name_div7 = document.getElementById('DIV_WS_7');
			let select_image_db = document.createElement('select');
			select_image_db.id = 'select_image_db';
			select_image_db.classList.add('selectStyle');
			let optionImagePostgreSQL = document.createElement('option');
			optionImagePostgreSQL.innerHTML = 'PostgreSQL';
			select_image_db.appendChild(optionImagePostgreSQL);
			name_div7.appendChild(select_image_db);



let paramsDB = [{
  "SMALL": {
    "vCPU": "1 core",
    "RAM": "1 GB",
    "SSD": "10 GB"
  },
  "MEDIUM": {
    "vCPU": "2 core",
    "RAM": "2 GB",
    "SSD": "10 GB"
  },
  "LARGE": {
    "vCPU": "4 core",
    "RAM": "8 GB",
    "SSD": "10 GB"
  }
}];				


			let name_div9 = document.getElementById('DIV_WS_9');
			name_div9.classList.add('divBottomMargin');
			for(let i = 0; i < paramsDB.length; i++){

				let tbl_res = document.createElement('table');
				tbl_res.setAttribute('width','100%');
				let tbl_res_tr = document.createElement('tr');
				let qnt = 1;
				for(key in paramsDB[i]){
					
					let tbl_res_tr_td = document.createElement('td'); 
					let tbl_res_tr_td_div = document.createElement('div'); 
					tbl_res_tr_td_div.id = 'DIV_WS_RDB_' + qnt;
					tbl_res_tr_td_div.setAttribute('align', 'center');
					tbl_res_tr_td_div.classList.add('divResourseWS');
					let div_resDB_tbl = document.createElement('table');
					let key_arr_tr_hdr = document.createElement('tr');
					let key_arr_td_hdr = document.createElement('td');
					let key_arr_p_hdr = document.createElement('p');
						key_arr_p_hdr.classList.add('pWSdiv');
						key_arr_p_hdr.innerHTML = key;	
					key_arr_td_hdr.appendChild(key_arr_p_hdr);
					key_arr_tr_hdr.appendChild(key_arr_td_hdr);
					div_resDB_tbl.appendChild(key_arr_tr_hdr);
					qnt_in = 1;
					for(key_arr in paramsDB[i][key]){

						let key_arr_tr = document.createElement('tr');
						let key_arr_td = document.createElement('td');
						let key_arr_p = document.createElement('p');
						
							key_arr_p.classList.add('pWSdiv1');
							let p_txt = key_arr + " : " + paramsDB[i][key][key_arr];
							key_arr_p.innerHTML = p_txt;

						key_arr_td.appendChild(key_arr_p);
						key_arr_tr.appendChild(key_arr_td);
						
						div_resDB_tbl.appendChild(key_arr_tr);
						
						qnt_in = qnt_in + 1;
					}
					
					tbl_res_tr_td_div.appendChild(div_resDB_tbl);
					tbl_res_tr_td.appendChild(tbl_res_tr_td_div);
					tbl_res_tr.appendChild(tbl_res_tr_td);
					tbl_res.appendChild(tbl_res_tr);
					name_div9.appendChild(tbl_res);
					qnt = qnt + 1;
				}
			}
			
			let resoursesDB = '';
			$(document).on('click','div[id^="DIV_WS_RDB_"]', function(data)
				{
					document.getElementById("DIV_WS_RDB_1").classList.remove('divResourseWSclk');
					document.getElementById("DIV_WS_RDB_2").classList.remove('divResourseWSclk');
					document.getElementById("DIV_WS_RDB_3").classList.remove('divResourseWSclk');
						
					document.getElementById(this.id).classList.add('divResourseWSclk');
					resoursesDB = this.id;
				});	


			let name_div11 = document.getElementById('DIV_WS_11');
			let select_net = document.createElement('select');
			select_net.id = 'select_net_ws';
			select_net.classList.add('selectStyle');
			let netShared = document.createElement('option');
			let netPublic = document.createElement('option');

			netPublic.innerHTML = 'external';

			select_net.appendChild(netPublic);
			name_div11.appendChild(select_net);	

			let name_div13 = document.getElementById('DIV_WS_13');
			let _select_vim = document.createElement('select');
			_select_vim.id = 'select_vim_ws';
			_select_vim.classList.add('selectStyle');
			
			for(let i=0; i < vims.length; i++){

				if(vims[i]["vim_type"] != "openstack"){
					continue;
				}
				else{

					for(key in vims[i]){
						if(key == 'name'){
							let _option = document.createElement('option');
							_option.id = 'OPT_WSDB' + vims[i][key];
						_option.innerHTML = vims[i][key]; // + '(' + vims[i]['vim_url'] + ')'
							_select_vim.appendChild(_option);
						}
					}
					name_div13.appendChild(_select_vim);	
				}
			}
		
			$("#input_name_wsdb").keyup(function(data)
			{
				var curStr = $('#input_name_wsdb').val();
				if(curStr.trim() !=  curStr)
				{
					document.getElementById("input_name_wsdb").value = curStr.trim();
				}
			});

			let _butt_exec = document.createElement('button');
			_butt_exec.id = 'execute_button_wsdb';
			_butt_exec.innerHTML = 'Создать';
			_butt_exec.classList.add('forbuttonExec');
			parentElem.appendChild(_butt_exec);



			$("#execute_button_wsdb").click(function() {
				let instanceName = $('#input_name_wsdb').val();

				let imageNameWS = $('#select_image_ws').val();
				
				//resoursesWS
				//resoursesDB
				
				let imageNameDB =  $('#select_image_db').val();

				let networkName = $('#select_net_ws').val();

				let vimName = $('#select_vim_ws').val();
				
				let vim_id = '';
				
				for(var i =0; i < vims.length; i++){
					
					if(vims[i]['name'] == vimName){
						vim_id = vims[i]['_id'];
					}
					
				}
				
				//Ubuntu 18.04.6-lts DIV_WS_RWS_1 DIV_WS_RDB_1 shared devstack_test
				
				let vCPUws = '';
				let RAMws = '';
				let storagews = '';

				let vCPUdb = '';
				let RAMdb = '';
				let storagedb = '';
				
				if(resoursesWS == 'DIV_WS_RWS_1'){
					vCPUws = '1';
					RAMws = '1';
					storagews = '5';
				}
				else if(resoursesWS == 'DIV_WS_RWS_2'){
					vCPUws = '2';
					RAMws = '2';
					storagews = '10';
				}					
				else if(resoursesWS == 'DIV_WS_RWS_3'){
					vCPUws = '4';
					RAMws = '8';
					storagews = '15';
				}				

				if(resoursesDB == 'DIV_WS_RDB_1'){
					vCPUdb = '1';
					RAMdb = '1';
					storagedb = '10';
				}
				else if(resoursesDB == 'DIV_WS_RDB_2'){
					vCPUdb = '2';
					RAMdb = '2';
					storagedb = '10';
				}					
				else if(resoursesDB == 'DIV_WS_RDB_3'){
					vCPUdb = '4';
					RAMdb = '8';
					storagedb = '10';
				}	

				//TODO
				let ip_database = "10.0.69.134";
				let ip_web_server = "10.0.69.130";
				
				if(instanceName != '' && resoursesWS != '' && resoursesDB != ''){
					
					console.log(instanceName + '' + imageNameWS + '' + resoursesWS + '' + resoursesDB + '' + networkName + '' + vimName);
					
										//////////////////////////////////////////// создадим VNFd
					$.ajax({
						type:"POST",
						url: "./core/engine.php",
						dataType: "json",
						data: {
							action: "createVNFDwsdb",
							name: instanceName,
							token: token,
							imageIDWS: imageNameWS,
							imageIDDB: imageNameDB,
							ramWS: RAMws,
							vCPUWS: vCPUws,
							storageWS: storagews,
							ramDB: RAMdb,
							vCPUDB: vCPUdb,
							storageDB: storagedb,							
							network: networkName,
							ipDB: ip_database,
							vim: vim_id
							},
						success: function(data) 
							{
								console.log(data);
								
								if(data["code"] == "CONFLICT"){
									alert(" Сервис с указанным именем существует в текущем проекте! ");
								}
								else{
									///////////////////////////////// создадим NSd
									$.ajax({
										type:"POST",
										url: "./core/engine.php",
										dataType: "json",
										data: {
											action: "createNSDwsdb",
											name: instanceName,
											token: token,
											ipDB: ip_database,
											ip_web_server: ip_web_server,
											network: networkName,
											vim: vim_id
											},
										success: function(data) 
											{
												console.log(data);
												let nsd_id = '';
												nsd_id = data['id'];
												
												
									///////////////////////////////// создадим NS !!!!!!!
												$.ajax({
													type:"POST",
													url: "./core/engine.php",
													dataType: "json",
													data: {
														action: "createNSwsdb",
														name: instanceName,
														token: token,
														vim: vim_id,
														ns_id: nsd_id,
														instanceType: 'webserver_database'
														},
													success: function(data) 
														{
															console.log(data);
															getInstances(token);
														}
												});
												
											}
									});
								
								}
								
							}
					});

				}
				else if(instanceName == ''){
					alert(" Не указано название сервиса! ");
				}				
				else if(resoursesWS == ''){
					alert(" Не выбраны ресурсы WS! ");
				}
				else if(resoursesDB == ''){
					alert(" Не выбраны ресурсы DB! ");
				}
			});






		}
});
	
	
	
	
	
}


//############################       COMPUTE


function createCompute(token){
	
	var mainDiv = document.getElementById("main_div");
	mainDiv.innerHTML = '';
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Создание сервиса';
	document.getElementById("placeMap").innerHTML = 'Создание сервиса';
	var services = new Object();
	services = {
		"name": "Имя сервиса",
		"image": "Образ операционной системы",
		"RAM": "Оперативная память, Gb",
		"vCPU": "Количество vCPU",
		"storage": "Место на диске, Gb",
		"network": "Сеть",
		"VIM": "Сайт EDGE",
	};
	
	//let vims = new Array();
	//vims = getVIMS(token);	
	//console.log(vims);
	//console.log(vims.length);
	generateDivCompute("main_div", services, token);
	
	

	
}


function generateDivCompute(div_id, head, token)
{
	

	
	var vims = new Array();
	var needParams = ["vim_url", "name", "vim_type", "_id"];
	
	$.ajax({
	type:"POST",
	url: "./core/engine.php",
	dataType: "json",
	data: {
		action: "getVims",
		token: token
		},
	success: function(data) 
		{

			if(data.length>=1){
				for(let i=0; i < data.length;i++){
					
					var arr = {};
					for(key in data[i]){
						if(needParams.indexOf(key) != -1){
							arr[key] = data[i][key];
						}
					}
					vims[i] = arr;
				}
			}
			else{
				console.log("getVIMS error!!!");
			}
			
			console.log(vims);
			let parentElem = document.getElementById(div_id);


			let _p = document.createElement('p');
			_p.innerHTML = "Создание сервиса Compute";
			_p.classList.add('headerMainDiv');
			parentElem.appendChild(_p);


			var col = 1;
			var row = Object.keys(head).length*2;
			let _tbl = document.createElement('table'); //table +
			_tbl.setAttribute('border', '0');
			_tbl.setAttribute('width', '45%');
			for(let i = 0; i < col; i++){
				for(let y = 0; y < row; y++){
					let _tr = document.createElement('tr');
					
					let _td = document.createElement('td');
					_td.id = 'TD_'+y;
					
					//раскидаем titles сразу.
					if(y%2 == 0){
						let num = y/2;
						let title = '';
						let i = 0;
						for(key in head){
							if(i == num){
								let _p = document.createElement('p');
								_p.id = 'P'+y;
								_p.innerHTML = head[key];
								_p.classList.add('computeTableP');
								_td.appendChild(_p);
							}
							i++;
						}
					}
					else{
						let _div = document.createElement('div');
						_div.id = 'DIV'+y;
						_td.appendChild(_div)
					}
					_tr.appendChild(_td);
					_tbl.appendChild(_tr);
				}
			}
			parentElem.appendChild(_tbl);
			
			
			let name_div1 = document.getElementById('DIV1');
			let name_input = document.createElement('input');
			name_input.id = 'input_name';
			name_input.classList.add('inputName');
			name_div1.appendChild(name_input);
			
			let name_div3 = document.getElementById('DIV3');
			let select_image = document.createElement('select');
			select_image.id = 'select_image';
			select_image.classList.add('selectStyle');
			let optionImageUbu18 = document.createElement('option');
			let optionImageUbu20 = document.createElement('option');
			optionImageUbu18.innerHTML = 'desktop-ubuntu-20.04';
			optionImageUbu20.innerHTML = 'Ubuntu 20.04';
			select_image.appendChild(optionImageUbu18);
			select_image.appendChild(optionImageUbu20);
			name_div3.appendChild(select_image);

			let name_div5 = document.getElementById('DIV5');
			let select_ram = document.createElement('select');
			select_ram.id = 'select_ram';
			select_ram.classList.add('selectStyle');
			let ram1 = document.createElement('option');
			let ram2 = document.createElement('option');
			let ram4 = document.createElement('option');
			let ram5 = document.createElement('option');
			ram1.innerHTML = '1';
			ram2.innerHTML = '2';
			ram4.innerHTML = '4';
			ram5.innerHTML = '5';
			select_ram.appendChild(ram1);
			select_ram.appendChild(ram2);
			select_ram.appendChild(ram4);
			select_ram.appendChild(ram5);
			name_div5.appendChild(select_ram);	

			let name_div7 = document.getElementById('DIV7');
			let select_vcpu = document.createElement('select');
			select_vcpu.id = 'select_vcpu';
			select_vcpu.classList.add('selectStyle');
			let vcpu1 = document.createElement('option');
			let vcpu2 = document.createElement('option');
			let vcpu4 = document.createElement('option');
			vcpu1.innerHTML = '1';
			vcpu2.innerHTML = '2';
			vcpu4.innerHTML = '4';
			select_vcpu.appendChild(vcpu1);
			select_vcpu.appendChild(vcpu2);
			select_vcpu.appendChild(vcpu4);
			name_div7.appendChild(select_vcpu);	

			let name_div9 = document.getElementById('DIV9');
			let select_stor = document.createElement('select');
			select_stor.id = 'select_stor';
			select_stor.classList.add('selectStyle');
			//let stor5 = document.createElement('option');
			let stor10 = document.createElement('option');
			let stor15 = document.createElement('option');
			//stor5.innerHTML = '5';
			stor10.innerHTML = '10';
			stor15.innerHTML = '15';
			//select_stor.appendChild(stor5);
			select_stor.appendChild(stor10);
			select_stor.appendChild(stor15);
			name_div9.appendChild(select_stor);	

			let name_div11 = document.getElementById('DIV11');
			let select_net = document.createElement('select');
			select_net.id = 'select_net';
			select_net.classList.add('selectStyle');
			let netShared = document.createElement('option');
			let netPublic = document.createElement('option');
			netShared.innerHTML = 'internal';
			netPublic.innerHTML = 'external';
			select_net.appendChild(netShared);
			select_net.appendChild(netPublic);
			name_div11.appendChild(select_net);	




			let name_div13 = document.getElementById('DIV13');
			let _select_vim = document.createElement('select');
			_select_vim.id = 'select_vim';
			_select_vim.classList.add('selectStyle');
			
			for(let i=0; i < vims.length; i++){

				if(vims[i]["vim_type"] != "openstack"){
					continue;
				}
				else{

					for(key in vims[i]){
						if(key == 'name'){
							let _option = document.createElement('option');
							_option.id = 'OPT_' + vims[i][key];
						_option.innerHTML = vims[i][key]; // + '(' + vims[i]['vim_url'] + ')'
							_select_vim.appendChild(_option);
						}
					}
					name_div13.appendChild(_select_vim);	
				}
			}
		
			$("#input_name").keyup(function(data)
			{
				var curStr = $('#input_name').val();
				if(curStr.trim() !=  curStr)
				{
					document.getElementById("input_name").value = curStr.trim();
				}
			});

			let _butt_exec = document.createElement('button');
			_butt_exec.id = 'execute_button';
			_butt_exec.innerHTML = 'Создать';
			_butt_exec.classList.add('forbuttonExec');
			parentElem.appendChild(_butt_exec);
			
			
			//var  = document.getElementById("main_div");
			$("#execute_button").click(function() {
				let instanceName = $('#input_name').val();

				let imageName = $('#select_image').val();

				let qntRAM = $('#select_ram').val();

				let qntvCPU = $('#select_vcpu').val();

				let qntStorage = $('#select_stor').val();

				let networkName = $('#select_net').val();

				let vimName = $('#select_vim').val();
				
				let vim_id = '';
				
				for(var i =0; i < vims.length; i++){
					
					if(vims[i]['name'] == vimName){
						vim_id = vims[i]['_id'];
					}
					
				}
				
				if(instanceName != ''){
					
					let alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789',
					pass_to_vnf = '';
					for(let i = 0; i < 4; i++){
					pass_to_vnf += alphabet[Math.round(Math.random() * (alphabet.length - 1))];
					}
					console.log(pass_to_vnf);
					
					//////////////////////////////////////////// создадим VNFd
					$.ajax({
						type:"POST",
						url: "./core/engine.php",
						dataType: "json",
						data: {
							action: "createVNFD",
							name: instanceName,
							token: token,
							imageID: imageName,
							ram: qntRAM,
							vCPU: qntvCPU,
							storage: qntStorage,
							network: networkName,
							vim: vim_id,
							pass: pass_to_vnf
							},
						success: function(data) 
							{
								if(data["code"] == "CONFLICT"){
									alert(" Сервис с указанным именем существует в текущем проекте! ");
								}
								else{
									///////////////////////////////// создадим NSd
									$.ajax({
										type:"POST",
										url: "./core/engine.php",
										dataType: "json",
										data: {
											action: "createNSD",
											name: instanceName,
											token: token,
											imageID: imageName,
											ram: qntRAM,
											vCPU: qntvCPU,
											storage: qntStorage,
											network: networkName,
											vim: vim_id
											},
										success: function(data) 
											{
												console.log(data);
												let nsd_id = '';
												nsd_id = data['id'];
									///////////////////////////////// создадим NS !!!!!!!
												$.ajax({
													type:"POST",
													url: "./core/engine.php",
													dataType: "json",
													data: {
														action: "createNS",
														name: instanceName,
														token: token,
														imageID: imageName,
														ram: qntRAM,
														vCPU: qntvCPU,
														storage: qntStorage,
														network: networkName,
														vim: vim_id,
														ns_id: nsd_id,
														instanceType: 'compute'
														},
													success: function(data) 
														{
															console.log(data);
															getInstances(token);
														}
												});
											}
									});
								
								}
							}
					});
					
				}
				else{
					alert(" Не указано название сервиса! ");
				}
			});
		}
});
	
	
	
	
	
	
	



}


//############################       INSTANCES


function getInstances(token){
	
	var grafana_url = 'http://10.0.69.115:3000/d/';
	
	document.getElementById("main_div").innerHTML = '';
	
	
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
	document.getElementById("placeMap").innerHTML = 'Мои сервисы';
	
	$.ajax({
	type:"POST",
	url: "./core/engine.php",
	dataType: "json",
	data: {
		action: "getInstancesAndVims",
		token: token
		},
	success: function(dataInstances) 
		{
			
				
			$.ajax({
				type:"POST",
				url: "./core/engine.php",
				dataType: "json",
				data: {
					action: "getVims",
					token: token,	
				},
				success: function(vims_accounts) 
					{
				
				//1//////////////////////////////// "code": "UNAUTHORIZED", ////////////////////////
						generateDivInfo("main_div", dataInstances, vims_accounts);

						let items = {};
						let current = 0;
						for(let i = 0; i < dataInstances.length; i++){
							
							if((dataInstances[i]["nsState"] != "READY") && (dataInstances[i]["nsState"] != "BROKEN")){
								let item = {};
								item.id = dataInstances[i]["_id"];
								item.state = dataInstances[i]["nsState"];
								items[current] = item;
								current = current + 1;
							}
						}

						console.log('items');
						console.log(items);
						console.log('dataInstances');
						console.log(dataInstances);
						
						var size = Object.keys(items).length;
						
						if(size > 0){
							console.log("существуют не READY");
							(function worker() {
							  $.ajax({
								url: './core/engine.php', 
								dataType: "json",
								data: {
									action: "getNsStates",
									token: token,
									obj: items
								},							
								success: function(data) 
								{
								  let flag = 0;
								  //а есть ли элементы в статусе не ready???
								  for(let i = 0; i < data.length; i++){
									  
									  let state_inst = data[i]["state"];
									  let uid_inst = data[i]["id"];
									  let need_id_td = document.getElementById('STATUS_TD_' + uid_inst);
									  let tdData = '';
									  let tdClass = '';
									  //TODO - проверить, есть ли элемент!
									  if(need_id_td != undefined){
									  if(state_inst != "READY"){

										 flag = flag + 1;

										 if(state_inst == 'BUILDING'){
											tdData = 'Создается';
											tdClass = 'tdMainDivStateBuild';
											need_id_td.innerHTML = "<img src='../images/prel_yellow.gif' valign='middle' style='margin-bottom: 4px;'/>";
											
										 }

										 else if(state_inst == 'TERMINATING'){
											tdData = 'Удаляется';
											tdClass = 'tdMainDivStateTerminating';	
											need_id_td.innerHTML = "<img src='../images/prel_red.gif' valign='middle' style='margin-bottom: 4px;'/>";
										 }
										 else if(state_inst == 'BROKEN'){
											tdData = 'Ошибка';
											tdClass = 'tdMainDivStateBroken';
											need_id_td.innerHTML = "<img src='../images/not_icon.png' valign='middle' style='margin-bottom: 4px;'/>";
											flag = 0;
										 }	
										need_id_td.innerHTML += ' ' + tdData;
										need_id_td.classList.add(tdClass);
										
									  }
										 else if(state_inst == 'READY'){
											tdData = 'Активен';
											tdClass = 'tdMainDivStateReady';
											need_id_td.innerHTML = "<img src='../images/ok_icon.png' valign='middle' style='margin-bottom: 4px;'/>";				
										 	need_id_td.innerHTML += ' ' + tdData;
											need_id_td.classList.add(tdClass);
										 }
									  }
									  else{
										 location.reload(); 
									  }
								  }
								  
								  if(flag == 0){
									 location.reload();
								  }
								  
								},
								complete: function() {
								  setTimeout(worker, 2000);
								}
							  });
							})();
						}


			    ///////////////////////////////////    удалить инстанс!!!!
				
						$('img').click(function()
						{
							
							var clickId = $(this).attr('id');
							
							if(clickId != undefined){

								if(clickId.indexOf("TRASH") >= 0){
									//TODO: возможная бага. Несколько раз может вызываться так как таких ID>1!!!
									ns_id_id = this.id;
									
									ns_id = ns_id_id.replace('TRASH_IMG_', '');

									$.ajax({
									type:"POST",
									url: "./core/engine.php",
									dataType: "json",
									data: {
										action: "deleteInstance",
										token: token,
										instance_id: ns_id
										},
									success: function(data) 
										{						
											location.reload();
										}
									});
								}
								else if(clickId.indexOf("FOLDER") >= 0){
									
			    ///////////////////////////////////    исследуем инстанс!!!!	
				
									ns_id_id = this.id;

									ns_id = ns_id_id.replace('FOLDER_IMG_', '');
									
									$.ajax({
									type:"POST",
									url: "./core/engine.php",
									dataType: "json",
									data: {
										action: "getVNFR",
										token: token
										},
									success: function(vnfrs) 
										{
											generateInfoInstance("main_div", ns_id, vnfrs, vims_accounts, dataInstances);
										}
									});
									
								}
								
							}
						});
						
						
						
						
						
					}
					});	
						

		}
	});
}


function generateInfoInstance(div_id, ns_id, vnfrs, vims_accounts, dataInstances)
{
	let parentElem = document.getElementById(div_id);
	
	console.log("vnfrs");
	console.log(vnfrs);
	console.log("dataInstances");
	console.log(dataInstances);

	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
	document.getElementById("placeMap").innerHTML = 'Информация о сервисе';
	document.getElementById("main_div").innerHTML = '';

	var head = {
		"_id": "ID инстанса",
		"name": "Название",
		"description": "Тип сервиса",
		"datacenter_name": "Площадка",
		"nsState": "Статус инстанса",
		"create-time": "Дата создания"
	};
	

	var params = {
		"_id": '',
		"name": '',
		"description": '',
		"datacenter_name": '',
		"nsState": '',
		"create-time": ''	
	};




	let service_type = '';
	let vim_url = '';
	let vim_naming = '';
	let vim_tenant = '';
	let password_instance = '12345';

	for(let i = 0; i < dataInstances.length; i++){
		
		if(dataInstances[i]['_id'] == ns_id){
			
			vim_url = dataInstances[i]["vim_url"];
			vim_tenant = dataInstances[i]["vim_tenant"];
			
			if(dataInstances[i]['vnfd-id']['0']['password'] != undefined){
				password_instance = dataInstances[i]['vnfd-id']['0']['password'];
			}
			
			for(key in head){
				params[key] = dataInstances[i][key];
				
				if(key == 'description'){
						service_type = dataInstances[i][key];
					}
				if(key == 'datacenter_name'){
						vim_naming = dataInstances[i][key];
					}
				if(key == 'create-time'){
					var date = new Date(dataInstances[i][key] * 1000);
					params[key] = formatDateWithHoursMin(date);
				}
			}
		}
	}

		////   ################    Общая инфа

	let _p = document.createElement('p');
	_p.innerHTML = "Сервис "+ name + ':';
	_p.classList.add('headerMainDiv');
	parentElem.appendChild(_p);

	
	let _tbl = document.createElement('table'); //table +
	_tbl.setAttribute('border', '0');
	_tbl.setAttribute('width', '60%');
	
	for (key in head) {
		
		let _tr_header = document.createElement('tr'); //tr +
			let _tb_header = document.createElement('td');
			_tb_header.setAttribute('align', 'center');
			_tb_header.innerHTML = head[key];
			_tb_header.classList.add('headerInfoTable');
			//_tb_txt.classList.add('dotable');
			
			let _tb_header_param = document.createElement('td');
			_tb_header_param.setAttribute('align', 'left');
			_tb_header_param.innerHTML = params[key];
			_tb_header_param.classList.add('tdMainDivReso');		
			
		_tr_header.appendChild(_tb_header);	
		_tr_header.appendChild(_tb_header_param);	
		_tbl.appendChild(_tr_header);
	}
	
	parentElem.appendChild(_tbl);
	
	
		////   ################    Параметры
	

	let _p_invites = document.createElement('p');
	_p_invites.innerHTML = "Доступы :";
	_p_invites.classList.add('headerMainDiv');
	parentElem.appendChild(_p_invites);
	
	
	let creds_openstack = {
		"devstack_114": "admin|devstack",
		"devstack_test": "admin|labstack",
		"openstack_EaaS": "admin|devstack",
		"Openstack_EAAS": "admin|devstack",
		"openstack_WORK": "admin|labstack",
		"openstack_EAAS": "admin|devstack",
		"EDGE_ONE": "admin|labstack",
		"EDGE_1": "admin|labstack",
		"EDGE_2": "admin|devstack",
		"EDGE_TWO": "admin|devstack",
	}
		



//						###### Compute ######

	if(service_type == 'compute'){
		
		var header_compute = {
			"ip": "IP-адрес",
			"console": "Консоль",
			"username": "Пользователь",
			"password": "Пароль"
		};

		var header_compute_params = {
			"ip": "",
			"console": "",
			"username": "ubuntu",
			"password": password_instance
		};		
		
		let console_name_machine = '';
		let console_id_machine = '';
		
		
		for(let i = 0; i < vnfrs.length; i++){

			if(vnfrs[i]["nsr-id-ref"] == ns_id){
				
				header_compute_params["ip"] = vnfrs[i]["ip-address"];
				arr_vim_info = vnfrs[i]["vdur"]["0"]["vim_info"];
				for(key in arr_vim_info){
					for(detail in arr_vim_info[key]){
						if(detail == 'vim_id'){
							console_id_machine = arr_vim_info[key][detail];
						}
						else if(detail == 'vim_name'){
							console_name_machine = arr_vim_info[key][detail];
						}
					}
				}
				
			}
			
		}

		let vim_pass = '';
		let vim_username = '';
		let vim_tennant = vim_tenant;
		let vim_creds = creds_openstack[vim_naming];
		//console.log(vim_creds);
		if(vim_creds == undefined){
			alert('Внесите данный VIM - "'+ vim_naming + '" в список!');
		}
		vim_username = vim_creds.split('|')[0];
		vim_pass = vim_creds.split('|')[1];

		$.ajax({
		type:"POST",
		url: "./core/engine.php",
		dataType: "json",
		data: {
			action: "getOpenstackToken",
			api_openstack: vim_url,
			openstack_user: vim_username,
			openstack_pass: vim_pass,
			openstack_tenant: vim_tennant,
			openstack_machine_id: console_id_machine
			},
		success: function(getToken) 
			{						
				
				let _tbl_comp = document.createElement('table'); //table +
				_tbl_comp.setAttribute('border', '0');
				_tbl_comp.setAttribute('width', '60%');
					
					for (key in header_compute) {
							
						let _tr_compute = document.createElement('tr');
						let _tb_compute_name = document.createElement('td');
							_tb_compute_name.setAttribute('align', 'left');
							_tb_compute_name.setAttribute('width', '40%');
							_tb_compute_name.innerHTML = header_compute[key];
							_tb_compute_name.classList.add('headerInfoTable');				
						
						let _tb_compute_peram = document.createElement('td');
							_tb_compute_peram.setAttribute('align', 'left');
							
							
							if(key == 'console'){
								if(header_compute_params['ip'] != null){
									_tb_compute_peram.innerHTML = '<a href="'+getToken+'" target="_blank">Подключиться</a>';
								}
								else{
									_tb_compute_peram.innerHTML = 'IP-адрес не назначен VIM';
								}
							}
							else if(key == 'ip'){
								if(header_compute_params[key] == null){
									_tb_compute_peram.innerHTML = 'IP-адрес не назначен VIM';
								}
								else{
								_tb_compute_peram.innerHTML = header_compute_params[key];
								}
							}
							else{
								_tb_compute_peram.innerHTML = header_compute_params[key];
							}
							
							_tb_compute_peram.classList.add('tdMainDivReso');			
					
					_tr_compute.appendChild(_tb_compute_name);	
					_tr_compute.appendChild(_tb_compute_peram);	
					_tbl_comp.appendChild(_tr_compute);			
					}
					
				parentElem.appendChild(_tbl_comp);

			}
		});	

	}//					###### WSDB ######
	else if(service_type == 'webserver_database'){
			
	var header_wsdb = {
		"ip": "IP-адрес",
		"username": "Пользователь",
		"password": "Пароль"
	};

	var header_wsdb_params = {
		"ip": "",
		"console": "",
		"username": "ubuntu",
		"password": ""
	};		
		
		let ip_ws = 'IP not allowed';
		let ip_db = 'IP not allowed';
		
		
		for(let i = 0; i < vnfrs.length; i++){

			if(vnfrs[i]["nsr-id-ref"] == ns_id){
				
				let arr_vm_info = vnfrs[i]["vdur"];
				
				for(key in arr_vm_info){

						if(arr_vm_info[key]['vdu-name'] == "ws_vm"){
							ip_ws = arr_vm_info[key]['ip-address'];
						}
						else if(arr_vm_info[key]['vdu-name'] == "db_vm"){
							ip_db = arr_vm_info[key]['ip-address'];
						}
						
					}
				}
			
		}
		
		
		let tbl_wsdb = document.createElement('table');
			tbl_wsdb.setAttribute('border', '0');
			tbl_wsdb.setAttribute('width', '50%');		
			
			
		let _tr_ws = document.createElement('tr');
			let _tb_ws_h = document.createElement('td');
				_tb_ws_h.setAttribute('align', 'center');
				_tb_ws_h.innerHTML = 'IP веб-сервера';
				_tb_ws_h.classList.add('headerInfoTable');
			
			let _tb_ws_p = document.createElement('td');
			_tb_ws_p.setAttribute('align', 'left');
			
			if(ip_ws == undefined){
			_tb_ws_p.innerHTML = 'IP-адрес пока не назначен со стороны VIM';	
			}
			else{
			_tb_ws_p.innerHTML = '<a href="http://'+ip_ws+'" target="_blank">Подключиться</a>';
			}
			
			_tb_ws_p.classList.add('tdMainDivReso');		
			
		_tr_ws.appendChild(_tb_ws_h);	
		_tr_ws.appendChild(_tb_ws_p);	
		tbl_wsdb.appendChild(_tr_ws);
		
		
		let _tr_db_adm = document.createElement('tr');
			let _tb_db_h1 = document.createElement('td');
				_tb_db_h1.setAttribute('align', 'center');
				_tb_db_h1.innerHTML = 'IP GUI базы данных';
				_tb_db_h1.classList.add('headerInfoTable');
			
			let _tb_db_p1 = document.createElement('td');
			_tb_db_p1.setAttribute('align', 'left');
			
			if(ip_db == undefined){
			_tb_db_p1.innerHTML = 'IP-адрес пока не назначен со стороны VIM';	
			}else{
			_tb_db_p1.innerHTML = '<a href="http://'+ip_db+'/pgadmin4" target="_blank">Подключиться</a>';
			}
			_tb_db_p1.classList.add('tdMainDivReso');		
			
		_tr_db_adm.appendChild(_tb_db_h1);	
		_tr_db_adm.appendChild(_tb_db_p1);	
		tbl_wsdb.appendChild(_tr_db_adm);

		let _tr_db_adm1 = document.createElement('tr');
			let _tb_db_h11 = document.createElement('td');
				_tb_db_h11.setAttribute('align', 'center');
				_tb_db_h11.innerHTML = 'Логин/Пароль от GUI';
				_tb_db_h11.classList.add('headerInfoTable');
			
			let _tb_db_p11 = document.createElement('td');
			_tb_db_p11.setAttribute('align', 'left');
			_tb_db_p11.innerHTML = 'admin@admin.ru : 123456';
			_tb_db_p11.classList.add('tdMainDivReso');		
			
		_tr_db_adm1.appendChild(_tb_db_h11);	
		_tr_db_adm1.appendChild(_tb_db_p11);	
		tbl_wsdb.appendChild(_tr_db_adm1);


		let _tr_db_adm2 = document.createElement('tr');
			let _tb_db_h2 = document.createElement('td');
				_tb_db_h2.setAttribute('align', 'center');
				_tb_db_h2.innerHTML = 'Подключение к БД, IP:port';
				_tb_db_h2.classList.add('headerInfoTable');
			
			let _tb_db_p2 = document.createElement('td');
			_tb_db_p2.setAttribute('align', 'left');
			_tb_db_p2.innerHTML = ip_db+':5432';
			_tb_db_p2.classList.add('tdMainDivReso');		
			
		_tr_db_adm2.appendChild(_tb_db_h2);	
		_tr_db_adm2.appendChild(_tb_db_p2);	
		tbl_wsdb.appendChild(_tr_db_adm2);

		parentElem.appendChild(tbl_wsdb);
	}//					                                 ###### INTERNET ######
	else if(service_type == 'internet'){
			
		var header_wsdb = {
			"internal_IP": "внутренний IP-адрес",
			"external_IP": "внешний IP-адрес"
		};

		var header_wsdb_params = {
			"internal_IP": "",
			"external_IP": ""
		};		
		
		let ip_int = 'IP-адрес пока не назначен VIM';
		let ip_ext = 'IP-адрес пока не назначен VIM';		
	
		for(let i = 0; i < vnfrs.length; i++){

			if(vnfrs[i]["nsr-id-ref"] == ns_id){
				
				let arr_vm_info = vnfrs[i]["vdur"]['0']["interfaces"];
				
				for(key in arr_vm_info){

						if(arr_vm_info[key]['ns-vld-id'] == "public"){
							ip_ext = arr_vm_info[key]['ip-address'];
						}
						else if(arr_vm_info[key]['ns-vld-id'] == "internal"){
							ip_int = arr_vm_info[key]['ip-address'];
						}
						
					}
				}
			
		}	
	
	
		let tbl_wsdb = document.createElement('table');
			tbl_wsdb.setAttribute('border', '0');
			tbl_wsdb.setAttribute('width', '50%');		
			
			
		let _tr_ws = document.createElement('tr');
			let _tb_ws_h = document.createElement('td');
				_tb_ws_h.setAttribute('align', 'center');
				_tb_ws_h.innerHTML = 'Внутренний IP-адрес';
				_tb_ws_h.classList.add('headerInfoTable');
			
			let _tb_ws_p = document.createElement('td');
			_tb_ws_p.setAttribute('align', 'left');
			if(ip_int == undefined){
				_tb_ws_p.innerHTML = 'IP-адрес еще не назначен VIM';
			}
			else{
				_tb_ws_p.innerHTML = ip_int;
			}		
			_tb_ws_p.classList.add('tdMainDivReso');		
			
		_tr_ws.appendChild(_tb_ws_h);	
		_tr_ws.appendChild(_tb_ws_p);	
		tbl_wsdb.appendChild(_tr_ws);
		
		
		let _tr_db_adm = document.createElement('tr');
			let _tb_db_h1 = document.createElement('td');
				_tb_db_h1.setAttribute('align', 'center');
				_tb_db_h1.innerHTML = 'Внешний IP-адрес';
				_tb_db_h1.classList.add('headerInfoTable');
			
			let _tb_db_p1 = document.createElement('td');
			_tb_db_p1.setAttribute('align', 'left');
			
			if(ip_ext == undefined){
				_tb_db_p1.innerHTML = 'IP-адрес еще не назначен VIM';
			}
			else{
				_tb_db_p1.innerHTML = ip_ext;
			}			
			_tb_db_p1.classList.add('tdMainDivReso');		
			
		_tr_db_adm.appendChild(_tb_db_h1);	
		_tr_db_adm.appendChild(_tb_db_p1);	
		tbl_wsdb.appendChild(_tr_db_adm);


		parentElem.appendChild(tbl_wsdb);
	
	}
	
}



function generateDivDry(div_id)
{
	let parentElem = document.getElementById(div_id);
		let _p = document.createElement('p');
		_p.innerHTML = "У вас пока нет созданных сервисов. Создайте сервис! :)";
		_p.classList.add('headerMainDiv');
	parentElem.appendChild(_p);
}



function generateDivInfo(div_id, data, vim_accounts)
{
	let parentElem = document.getElementById(div_id);
if(data.length < 1){
	
	
		let _p = document.createElement('p');
		_p.innerHTML = "У вас пока нет созданных сервисов. Создайте сервис! :)";
		_p.classList.add('headerMainDiv');
	parentElem.appendChild(_p);
	
}
else{
	
	var grafana_url = 'http://10.0.69.115:3000/d/';
	//console.log(data);
	var head = {
		//"_id": "ID сервиса",
		"name": "Имя инстанса",
		"description": "Тип сервиса",
		"datacenter_name": "Сайт EDGE",
		"vim_type": "Тип EDGE",
		"nsState": "Статус",
		"create-time": "Дата создания",
		"revision": "Действия"
	};
	


	//Заголовок Перед таблицей
	let _p = document.createElement('p');
	_p.innerHTML = "Сервисы";
	_p.classList.add('headerMainDiv');
	parentElem.appendChild(_p);


	let _tbl = document.createElement('table'); //table +
	_tbl.setAttribute('border', '0');
	_tbl.setAttribute('width', '90%');
	// шапка
	let _tr_header = document.createElement('tr'); //tr +
	for (key in head) {
		let _tb_header = document.createElement('td');
		_tb_header.setAttribute('align', 'center');
		_tb_header.innerHTML = head[key];
		_tb_header.classList.add('headerInfoTable');
		//_tb_txt.classList.add('dotable');
	_tr_header.appendChild(_tb_header);	
	}
	_tbl.appendChild(_tr_header);

	//остальная таблица
	for (var i = 0; i < data.length; i++){
		//console.log( data.length);
		let _tr = document.createElement('tr'); //tr +
		
		for(key in head){
			//console.log(key);
			if (data[i].hasOwnProperty(key)) {
				//console.log(data[i]);
				let _tb = document.createElement('td');
				
				
				var tdData = data[i][key];
				var tdClass = 'tdMainDiv';

				if(key == 'create-time'){
					var date = new Date(tdData * 1000);
					tdData = formatDate(date);
				}
				else if(key == 'nsState'){
					
					_tb.id = 'STATUS_TD_' + data[i]["_id"];
					
					if(tdData == 'BUILDING'){
						tdData = 'Создается';
						tdClass = 'tdMainDivStateBuild';
						_tb.innerHTML = "<img src='../images/prel_yellow.gif' valign='middle' style='margin-bottom: 4px;'/>";
						
					}
					else if(tdData == 'READY'){
						tdData = 'Активен';
						tdClass = 'tdMainDivStateReady';
						_tb.innerHTML = "<img src='../images/ok_icon.png' valign='middle' style='margin-bottom: 4px;'/>";				
					}
					else if(tdData == 'TERMINATING'){
						tdData = 'Удаляется';
						tdClass = 'tdMainDivStateTerminating';	
						_tb.innerHTML = "<img src='../images/prel_red.gif' valign='middle' style='margin-bottom: 4px;'/>";
					}
					else if(tdData == 'BROKEN'){
						tdData = 'Ошибка';
						tdClass = 'tdMainDivStateBroken';
						_tb.innerHTML = "<img src='../images/not_icon.png' valign='middle' style='margin-bottom: 4px;'/>";				
					}				
				}

				//статусы: BUILDING, READY, TERMINATING, 
				_tb.innerHTML += ' ' + tdData;
				
				//костыль для действий!!!!
				if(key == 'revision'){
					url_to_metric = grafana_url + data[i]['_id'];
					_tb.innerHTML = "<a href="+url_to_metric+" target='_blank'><img src='../images/metrics.png' valign='middle' alt='Метрики' style='margin-bottom: 4px;'/></a> <img id = "+ 'TRASH_IMG_' + data[i]['_id'] +" src='../images/trash.png' valign='middle' alt='Отключить инстанс' style='cursor: pointer; margin-bottom: 4px;'/> <img id = "+ 'FOLDER_IMG_' + data[i]['_id'] +" src='../images/folder.png' valign='middle' alt='Отключить инстанс' style='cursor: pointer; margin-bottom: 4px;'/>";
				}
				
				_tb.classList.add(tdClass);					
				
				_tr.appendChild(_tb);	
			}
		}
		_tbl.appendChild(_tr);
	}
	parentElem.appendChild(_tbl);

}

				//
				//  #########################################################     РЕСУРСЫ!!!!
				//



	//Заголовок Перед таблицей
	let _p_resources = document.createElement('p');
	_p_resources.innerHTML = "Ресурсы";
	_p_resources.classList.add('headerMainDiv');
	parentElem.appendChild(_p_resources);

	console.log(vim_accounts);
	
	
	for (var i = 0; i < vim_accounts.length; i++){
		if(vim_accounts[i]["vim_type"] != 'openstack'){
			continue;
		}
		else{
			
			///// таблица с ресурсами
			
			let tbl_id = document.createElement('table');
				tbl_id.setAttribute('border', '0');
				//tbl_id.setAttribute('width', '50%');
				tbl_id.classList.add('tblResourses');
				
			let _tr_head = document.createElement('tr');
				
				let td_id_name = document.createElement('td');
				td_id_name.innerHTML = 'Сайт EDGE';
				td_id_name.classList.add('headerResoTable');
				
				let td_id_attr = document.createElement('td');
				td_id_attr.innerHTML = vim_accounts[i]["name"];
				td_id_attr.setAttribute('colspan', '2');
				td_id_attr.classList.add('tdMainDivReso');
				
			_tr_head.appendChild(td_id_name);
			_tr_head.appendChild(td_id_attr);
			

			
			let _tr_url = document.createElement('tr');
				
				let td_url_name = document.createElement('td');
				td_url_name.innerHTML = 'Auth URL';
				td_url_name.classList.add('headerResoTable');
				
				let td_url_attr = document.createElement('td');
				td_url_attr.innerHTML = vim_accounts[i]["vim_url"];
				td_url_attr.setAttribute('colspan', '2');
				td_url_attr.classList.add('tdMainDivReso');
				
			_tr_url.appendChild(td_url_name);	
			_tr_url.appendChild(td_url_attr);	
			
			
			let _tr_vCPU = document.createElement('tr');
				
				let td_vCPU_name = document.createElement('td');
				td_vCPU_name.innerHTML = 'vCPU';
				td_vCPU_name.classList.add('headerResoTable');
				
				let td_vCPU_attr = document.createElement('td');
				let curvCPU = vim_accounts[i]["resources"]["compute"]["vcpus"]["used"];
				let allCPU = vim_accounts[i]["resources"]["compute"]["vcpus"]["total"];
				let percentVCPU = (curvCPU/allCPU)*100;
				//td_vCPU_attr.innerHTML = "<progress value="+curvCPU+" max="+allCPU+" class = 'forProgressBar'></progress>" + '[' + curvCPU + ' из ' + allCPU + ']';
				td_vCPU_attr.innerHTML = '<div id="container" style="width:120px; height:15px; border:1px solid #003300; border-radius: 3px; "><div id="progress-bar" style="width:'+percentVCPU+'%; background-image: repeating-linear-gradient(60deg, #00e600 0, #00e600 5px, #00cc00 5px, #00cc00 10px); height:100%; text-align: center; "></div></div>';
				td_vCPU_attr.classList.add('tdMainDivReso');
				
				let td_vCPU_txt = document.createElement('td');
				td_vCPU_txt.innerHTML = '[' + curvCPU + ' из ' + allCPU + ']';
				td_vCPU_txt.classList.add('tdMainDivReso_');
				
				
			_tr_vCPU.appendChild(td_vCPU_name);
			_tr_vCPU.appendChild(td_vCPU_attr);
			_tr_vCPU.appendChild(td_vCPU_txt);		
			

			let _tr_RAM = document.createElement('tr');
				
				let td_RAM_name = document.createElement('td');
				td_RAM_name.innerHTML = 'RAM';
				td_RAM_name.classList.add('headerResoTable');
				
				let td_RAM_attr = document.createElement('td');
				let curRAM = vim_accounts[i]["resources"]["compute"]["ram"]["used"]/1024;
				let allRAM = vim_accounts[i]["resources"]["compute"]["ram"]["total"]/1024;
				let percentRAM = (curRAM/allRAM)*100;
				td_RAM_attr.innerHTML = '<div id="container" style="width:120px; height:15px; border:1px solid #003300; border-radius: 3px; "><div id="progress-bar" style="width:'+percentRAM+'%; background-image: repeating-linear-gradient(60deg, #00e600 0, #00e600 5px, #00cc00 5px, #00cc00 10px); height:100%; text-align: center; "></div></div>';
				td_RAM_attr.classList.add('tdMainDivReso');

				let td_RAM_txt = document.createElement('td');
				td_RAM_txt.innerHTML = '[' + curRAM + ' из ' + allRAM + 'GB]';
				td_RAM_txt.classList.add('tdMainDivReso_');

				
			_tr_RAM.appendChild(td_RAM_name);	
			_tr_RAM.appendChild(td_RAM_attr);	
			_tr_RAM.appendChild(td_RAM_txt);	


			let _tr_storage = document.createElement('tr');
				
				let td_sto_name = document.createElement('td');
				td_sto_name.innerHTML = 'storage';
				td_sto_name.classList.add('headerResoTable');
				
				let td_sto_attr = document.createElement('td');
				let curSto = vim_accounts[i]["resources"]["storage"]["storage"]["used"];
				let allSto = vim_accounts[i]["resources"]["storage"]["storage"]["total"];
				let percentStor = (curSto/allSto)*100;
				//td_sto_attr.setAttribute('valign', 'middle');
				td_sto_attr.innerHTML = '<div id="container" style="width:120px; height:15px; border:1px solid #003300; border-radius: 3px; "><div id="progress-bar" style="width:'+percentStor+'%; background-image: repeating-linear-gradient(60deg, #00e600 0, #00e600 5px, #00cc00 5px, #00cc00 10px); height:100%; text-align: center; "></div></div>';
				td_sto_attr.classList.add('tdMainDivReso');

				let td_sto_txt = document.createElement('td');
				td_sto_txt.innerHTML = '[' + curSto + ' из ' + allSto + 'GB]';
				td_sto_txt.classList.add('tdMainDivReso_');

				
			_tr_storage.appendChild(td_sto_name);	
			_tr_storage.appendChild(td_sto_attr);	
			_tr_storage.appendChild(td_sto_txt);
			
			
			tbl_id.appendChild(_tr_head);
			tbl_id.appendChild(_tr_url);
			tbl_id.appendChild(_tr_vCPU);
			tbl_id.appendChild(_tr_RAM);
			tbl_id.appendChild(_tr_storage);
			
			if(vim_accounts[i]["resources"]["compute"]["vcpus"]["used"] == null){
				
				td_vCPU_attr.innerHTML = "<img src='../images/prel_vim.gif' valign='middle' alt='Метрики' style='margin-bottom: 4px;'/></img>" + '  информация обновляется';	
				td_vCPU_txt.innerHTML = '';
	
				td_RAM_attr.innerHTML = "<img src='../images/prel_vim.gif' valign='middle' alt='Метрики' style='margin-bottom: 4px;'/></img>" + '  информация обновляется';				
				td_RAM_txt.innerHTML = '';


				td_sto_attr.innerHTML = "<img src='../images/prel_vim.gif' valign='middle' alt='Метрики' style='margin-bottom: 4px;'/></img>" + '  информация обновляется';		
				td_sto_txt.innerHTML = '';	
			}
			
			parentElem.appendChild(tbl_id);	
		}
	}
}








function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear();

  return dd + '.' + mm + '.' + yy;
}


function formatDateWithHoursMin(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear();

  var hh = date.getHours();
  if (hh < 10) hh = '0' + hh;

  var mi = date.getMinutes();
  if (mi < 10) mi = '0' + mi;


  return dd + '.' + mm + '.' + yy + ' ' + hh + ':' + mi;
}