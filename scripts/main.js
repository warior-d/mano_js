//17.12.2019
$(document).ready(function(){
	
	var mainDiv = document.getElementById("main_div");
	// сначала - извлечем токен из localStorage!
	var token = localStorage.getItem('MANOtokenID');

	// Заполним инстансы, если есть!
	getInstances(token);


	//по-умолчанию мы показывает Ресурсы!
	var p_road = document.getElementById("roadMap");
	var p_place = document.getElementById("placeMap");
	
	p_road.innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
	p_place.innerHTML = 'Мои ресурсы';


	//создать compute
	$("#div_compute").click(function() {
		mainDiv.innerHTML = '';
		console.log("compute");
		createCompute(token);
		
		// createCompute (getVIMS) ->  generateDivCompute 

	});	
	
	//создать dbas
	$("#div_dbaas").click(function() {
		
		console.log("dbas");

	});	
	
	//создать ws
	$("#div_ws").click(function() {
		
		console.log("web server");

	});	

	//создать test
	$("#div_test").click(function() {
		
		console.log("test");

	});	

	$("#div_dashboard").click(function() {
		
		mainDiv.innerHTML = '';
		getInstances(token);

	});	



});





function createCompute(token){
	
	var mainDiv = document.getElementById("main_div");
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Создание ресурса';
	document.getElementById("placeMap").innerHTML = 'Создание ресурса';
	var services = new Object();
	services = {
		"name": "Название сервиса",
		"image": "Образ операционной системы",
		"RAM": "Оперативная память, Gb",
		"vCPU": "Количество vCPU",
		"storage": "Место на диске, Gb",
		"network": "Сеть",
		"VIM": "Площадка",
	};
	
	//let vims = new Array();
	//vims = getVIMS(token);	
	//console.log(vims);
	//console.log(vims.length);
	generateDivCompute("main_div", services, token);
	
	

	
}

//****	div_id - "main_div"
function generateDivCompute(div_id, head, token)
{
	var vims = new Array();
	var needParams = ["vim_url", "name", "vim_type"];
	
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
			
			
			let parentElem = document.getElementById(div_id);


			let _p = document.createElement('p');
			_p.innerHTML = "Создание сервиса compute";
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
			optionImageUbu18.innerHTML = 'Ubuntu 18.04';
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
			let stor5 = document.createElement('option');
			let stor10 = document.createElement('option');
			let stor15 = document.createElement('option');
			stor5.innerHTML = '5';
			stor10.innerHTML = '10';
			stor15.innerHTML = '15';
			select_stor.appendChild(stor5);
			select_stor.appendChild(stor10);
			select_stor.appendChild(stor15);
			name_div9.appendChild(select_stor);	

			let name_div11 = document.getElementById('DIV11');
			let select_net = document.createElement('select');
			select_net.id = 'select_net';
			select_net.classList.add('selectStyle');
			let netShared = document.createElement('option');
			let netPublic = document.createElement('option');
			netShared.innerHTML = 'Shared';
			netPublic.innerHTML = 'Public';
			select_net.appendChild(netShared);
			select_net.appendChild(netPublic);
			name_div11.appendChild(select_net);	




			let name_div13 = document.getElementById('DIV13');
			let _select_vim = document.createElement('select');
			_select_vim.id = 'select_vim';
			_select_vim.classList.add('selectStyle');
			//console.log(vimList.length);
			
			for(let i=0; i < vims.length; i++){
				console.log('22222');
				if(vims[i]["vim_type"] != "openstack"){
					continue;
				}
				else{
					//console.log(vimList[i]);
					for(key in vims[i]){
						if(key == 'name'){
							let _option = document.createElement('option');
							_option.id = 'OPT_' + vims[i][key];
							_option.innerHTML = vims[i][key];
							_select_vim.appendChild(_option);
						}
					}
					name_div13.appendChild(_select_vim);	
				}
			}
			
		// обрежем пробелы
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
				console.log("jejejeje");
			});
		}
});
	
	
	
	
	
	
	



}











function getInstances(token){
	
	var instancesShortArr = new Object();
	
	document.getElementById("roadMap").innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
	document.getElementById("placeMap").innerHTML = 'Мои ресурсы';
	
	$.ajax({
	type:"POST",
	url: "./core/engine.php",
	dataType: "json",
	data: {
		action: "getInstances",
		token: token
		},
	success: function(data) 
		{
			
			if(data.length == 0){
				//console.log('сервисов нет!');
				// здесь функция (она же на дашборде), генерящая DIV с предложением забабахать инстансы!
				generateDivDry("main_div");
			}
			else{
				
				////////////////////////////////// "code": "UNAUTHORIZED", ////////////////////////
				
				
				//console.log('сервисов '+data.length+'!');
				
				var header = {
					"_id": "ID сервиса",
					'name': "Название",
					"nsState": "Статус",
					"create-time": "Дата создания",
				};
				
				//console.log(data);
				
				for (var i = 0; i < data.length; i++) {
					var elemArr = {};
					//переберем весь массив
					for (key in data[i]) {
						//переберем всё в [i]
						if (data[i].hasOwnProperty(key)) {
							//ищем соотевтсвие в header!
							if (header.hasOwnProperty(key)){
								elemArr[key] = data[i][key];
							}
							
						}
						
					}
					instancesShortArr[i] = elemArr;
				
				}
				
				//console.log(instancesShortArr);
				generateDivInfo("main_div", header, data);
				
				
			}
		}
	});
}








//****	div_id - "main_div"
function generateDivDry(div_id)
{
	let parentElem = document.getElementById(div_id);
		let _p = document.createElement('p');
		_p.innerHTML = "У вас пока нет созданных сервисов. Создайте сервис! :)";
		_p.classList.add('headerMainDiv');
	parentElem.appendChild(_p);
}





//****	div_id - "main_div"
function generateDivInfo(div_id, head, data)
{
let parentElem = document.getElementById(div_id);

//Заголовок Перед таблицей
	let _p = document.createElement('p');
	_p.innerHTML = "Ресурсы";
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
	//console.log("main table");
	//console.log(data.length);
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
				
				}
				

				//статусы: BUILDING, READY, TERMINATING, 
				_tb.innerHTML += ' ' + tdData;
				_tb.classList.add(tdClass);					
				
				_tr.appendChild(_tb);	
			}
			
		}
		
		_tbl.appendChild(_tr);
		
		
	}
	
	parentElem.appendChild(_tbl);
}


function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
}