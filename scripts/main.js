//17.12.2019
$(document).ready(function(){
	
	var mainDiv = document.getElementById("main_div");
	// сначала - извлечем токен из localStorage!
	var token = localStorage.getItem('MANOtokenID');

	// Заполним инстансы, если есть!
	getInstans(token);


	//по-умолчанию мы показывает Ресурсы!
	var p_road = document.getElementById("roadMap");
	var p_place = document.getElementById("placeMap");
	
	p_road.innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
	p_place.innerHTML = 'Мои ресурсы';


	//создать compute
	$("#div_compute").click(function() {
		
		console.log("compute");

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
		getInstans(token);

	});	



});












function getInstans(token){
	
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
	
	
	//основное тело т
	
	
/*
		let _tb_txt = document.createElement('td');
		_tb_txt.innerHTML = txtDiv;
		_tb_txt.classList.add('dotable');
	
	_tr_txt.appendChild(_tb_txt);
	_tbl.appendChild(_tr_txt);	
	
	let _tr_inp = document.createElement('tr');
	
		let _tb_cls = document.createElement('td');
			let _inp_cl = document.createElement('input');
			_inp_cl.id = 'INP_CLS_'+idDiv;
			_inp_cl.setAttribute("size", "54");
			_inp_cl.setAttribute("placeholder", "Введите класс");
			_inp_cl.setAttribute("type", "hidden");
			_inp_cl.classList.add('inputclass');
		_tb_cls.appendChild(_inp_cl);


			let _div_cls = document.createElement('DIV');
			_div_cls.classList.add(cls);
			_div_cls.id = 'ID_CL_'+idDiv;
			_tb_cls.appendChild(_div_cls);		
		
		
		let _tb_res = document.createElement('td');
			let _inp_res = document.createElement('input');
			_inp_res.id = 'INP_RES_'+idDiv;
			_inp_res.setAttribute("size", "54");
			_inp_res.setAttribute("placeholder", "Введите ресурс");
			_inp_res.setAttribute("type", "hidden");
			_inp_res.classList.add('inputclass');
		_tb_res.appendChild(_inp_res);
		
			let _div_res = document.createElement('DIV');
			_div_res.classList.add(cls);
			_div_res.id = 'ID_RES_'+idDiv;
			_tb_res.appendChild(_div_res);
		
	_tr_inp.appendChild(_tb_cls);
	_tr_inp.appendChild(_tb_res);
	_tbl.appendChild(_tr_inp);	
*/
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