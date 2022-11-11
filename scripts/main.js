//17.12.2019
$(document).ready(function(){
	
	
	// сначала - извлечем токен из localStorage!
	var token = localStorage.getItem('MANOtokenID');
	var mainDiv = document.getElementById("main_div");
	console.log(token);
	var instancesShortArr = {};

	//по-умолчанию мы показывает Ресурсы!
	var p_road = document.getElementById("roadMap");
	var p_place = document.getElementById("placeMap");
	
	p_road.innerHTML = 'EaaS &nbsp &nbsp>&nbsp &nbsp  Дашборд';
	p_place.innerHTML = 'Мои ресурсы';



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
				console.log('сервисов нет!');
				// здесь функция (она же на дашборде), генерящая DIV с предложением забабахать инстансы!
				generateDivDry("main_div");
			}
			else{
				console.log('сервисов '+data.length+'!');
				
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
				
				console.log(instancesShortArr);
				generateDivInfo("main_div", header);
				
				
			}
		}
	});


/*	
	$("#auth_button").click(function() {
		
		var errorDiv = document.getElementById("hidden_txt");
		errorDiv.innerHTML = '';
		
		var username = $('#input_login').val();
		var pass = $('#input_password').val();
		if(username == "" || pass == "")
		{
			errorDiv.innerHTML = 'Введите логин/пароль!';
		}
		else
		{
			$.ajax({
			type:"POST",
			url: "./core/engine.php",
			dataType: "json",
			data: {
				action: "postAuth",
				username: username,	
				pass: pass
				},
			success: function(data) 
				{
					console.log(data['id']);
					
					if(data.hasOwnProperty("code")){
						errorDiv.innerHTML = data["detail"];
					}
					else{
						localStorage.setItem('MANOtokenID', data["id"]);
						localStorage.setItem('MANOtokenEXPIRED', data["expires"]);
						window.open("http://10.0.69.118/index.php");
					}
				}
			});
		}
		
	});
	
*/
});

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
function generateDivInfo(div_id, head)
{
let parentElem = document.getElementById(div_id);

//Заголовок Перед таблицей
	let _p = document.createElement('p');
	_p.innerHTML = "Ресурсы";
	_p.classList.add('headerMainDiv');
	parentElem.appendChild(_p);


let _tbl = document.createElement('table'); //table +
_tbl.setAttribute('border', '0');
_tbl.setAttribute('width', '100%');
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