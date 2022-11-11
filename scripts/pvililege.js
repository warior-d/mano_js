//17.12.2019
$(document).ready(function()
	{
		document.getElementById("sel_some").value = '';
		
		document.getElementById("userFIO").value = '';
		
			$("#sel_some").on("input",function(data){
				//обсчет всех элементов в выбранном
				var curStr = $('#sel_some').val();
				var sys = checkRadioBtn();
				if(curStr.length >= 3)
				{
					$.ajax({
					type: 'POST',
					url: 'engine.php',
					dataType: 'json',
					data: {
							action: "getPrivs",
							txt_priv: curStr,
							without: callChildtoStr('grants'),
							sheme: sys
						  }, 
					success: function(data) 
						{
							$("#main").html('');
							for (var i = 0; i < data.length; i++)
							{
								var txt = data[i]['TXT'];
								var divID = data[i]['ID_PRIV'];
								createDIVinpTABL(txt, 'main', divID, 'do', 'ID_PRIV_'+divID, 'beh');
							}
						}
						});
				}
				else
				{
					$("#main").html('');
				}
				}); //end of het privs


		//клик по выбранной привилегии в зависимости от текущего DIVa
		$(document).on('click','div[name^="ID_PRIV_"]', function(data)
		{
			let newNode = '';
			this.parentNode.id == 'grants' ? newNode = 'main' : newNode = 'grants';

			if(this.id != 'undefined')
			{
				moveDIV(this.id, newNode, 'done');
				if(this.parentNode.id == 'grants')
				{
					document.getElementById("INP_CLS_"+this.id).removeAttribute("type");
					document.getElementById("INP_CLS_"+this.id).value = '';
				}
				else
				{
					document.getElementById("INP_CLS_"+this.id).setAttribute("type", "hidden");
					document.getElementById("INP_RES_"+this.id).setAttribute("type", "hidden");
				}
				console.log('Количество деток в грантс = '+qntChild('grants'));
			}
			qntChild('grants') > 0 ? $('#refresh').show() : $('#refresh').hide();
			qntChild('grants') > 0 ? $('#userFIO').show() : $('#userFIO').hide();
			//console.log(checkRadioBtn());
		});

		//закрытие всплывушек по эскейпу
		$(document).keydown(function(eventObject){
			if( eventObject.which == 27 ){
				document.getElementById("userFIO").value = '';
				$('.beh').html('');	
				$('.beh').css('display', 'none');
			};
		});

		//работа с классом и ресурсом #1 - подгрузка значений класса
 		$(document).on('click','input[id^="INP_CLS_"]', function(data){
			$('.beh').html('');	
			let id = this.id;
			let id_clear = toNum(id);
			data.stopPropagation();
				$.ajax({
					type: 'POST',
					url: 'engine.php',
					dataType: 'json',
					data: {
							action: "getClass"
						  }, 
					success: function(data) 
						{
						let needId = "ID_CL_"+id_clear;
						$('#'+needId).css('display', 'block');
						createClsDIV(data, 'listOfUsers', needId, 'CLASS_', 'CLASS_ID', 'CLASS_NAME');
						}
				});
		});	 		

		//работа с классом и ресурсом #1_2 - клик на классе
		$(document).on('click','DIV[id^="CLASS_"]', function(data){
			data.stopPropagation();
			let parentId = document.getElementById(this.id).parentNode.id; //определим родителя, для ID
			let NumPar = toNum(parentId);
			let realClass = toNum(this.id);
			document.getElementById("INP_CLS_"+NumPar).value = this.innerHTML;
			closeFloat('beh');
			console.log(realClass);
			//работа с классом закончена

				document.getElementById("INP_RES_"+NumPar).removeAttribute("type"); //пусть для ресурсов станет видим инпут
				document.getElementById("INP_RES_"+NumPar).value = '';
			});

			//вывод списка ресурсов по клику...
			$(document).on('click','input[id^="INP_RES_"]', function(data){
					data.stopPropagation();
					$('.beh').html('');	
					let relCls = toNum(this.id); //определим ID этого инпута, чтобы взять значение класса!
					let clsName = $('#INP_CLS_'+relCls).val();
					let curRes = $('#INP_RES_'+relCls).val();
					console.log(clsName+' '+relCls);
					Ajax_do(clsName, relCls, curRes);
			});
			
			//... и по вводу
			$(document).on('input','input[id^="INP_RES_"]', function(data){
					data.stopPropagation();
					$('.beh').html('');	
					let relCls = toNum(this.id); //определим ID этого инпута, чтобы взять значение класса!
					let clsName = $('#INP_CLS_'+relCls).val();
					let curRes = $('#INP_RES_'+relCls).val();
					console.log(clsName+' '+relCls);
					Ajax_do(clsName, relCls, curRes);
			});
			
			//клик по ресурсу
			$(document).on('click','div[id^="RESOURSE_"]', function(data){
				data.stopPropagation();
				let parentId = document.getElementById(this.id).parentNode.id; //определим родителя, для ID
				let NumPar = toNum(parentId);
				let realResourse = toNum(this.id);
				document.getElementById("INP_RES_"+NumPar).value = this.innerHTML;
				closeFloat('beh');
				console.log(realResourse);
			});
			
			//запрос чего-то там			
			function Ajax_do(class_Name,NumPar, strRes){
			$.ajax({
					type: 'POST',
					url: 'engine.php',
					dataType: 'json',
					data: {
							action: "getResourseByClass",
							className: class_Name,
							curStr: strRes
						  }, 
					success: function(data) 
						{
						let needId = "ID_RES_"+NumPar;
						$('#'+needId).css('display', 'block');
						createClsDIV(data, 'listOfUsers', needId, 'RESOURSE_', 'RES_ID', 'RES_NAME');
						}
				});
			}

		//поиск Юзера		
		$("#userFIO").on("input",function(data){
			let curUser = $('#userFIO').val();
			if(curUser.length >= 3)
					{
						$.ajax({
							type: 'POST',
							url: 'engine.php',
							dataType: 'json',
							data: {
									action: "getUser",
									user: curUser
								  }, 
							success: function(data) 
								{
								$("#block").html('');	
								$('#block').css('display', 'block');
								createSelDIV(data, 'block'); //вывод возвращанных пользователей
								}
							}); 
					$(document).on('click','div[name^="GOOD_"]', function(data)
					{
						document.getElementById("userFIO").value = this.id;
						$('#block').css('display', 'none');
					});
					}
			else if (curUser.length < 3)
			{
			$("#block").html('');	
			$('#block').css('display', 'none');
			}
		});	
		
	


//*********************************************** По клику на обновлении привилегий нужно:
// 1) подсчитать именно res_id, если их не выберут - глобально!
	
		
	});
//****	
function closeFloat(clas)
{
$('.'+clas).html('');	
$('.'+clas).css('display', 'none');
}
//***
function toNum(someStr)
{
	return parseInt(someStr.replace(/\D+/g,""));
}

//****  class_id,  class_name 
function createClsDIV(divDATA,cls, idPar, fisrtName, idElem, txtElem)
{
let _par = document.getElementById(idPar);
for (let i = 0; i < divDATA.length; i++)
	{
		let _div = document.createElement('DIV');
		_div.innerHTML = divDATA[i][txtElem];
		_div.id = fisrtName+divDATA[i][idElem];
		_div.classList.add('listOfUsers');
		_par.appendChild(_div);
	}
}
//****
function createDIVinpTABL(txtDiv, idEl, idDiv, divClass, divName, cls)
{
let _div = document.createElement('DIV');
_div.id = idDiv;
_div.classList.add(divClass);
_div.setAttribute('name', divName);

let _tbl = document.createElement('table'); //table +

//_tbl.setAttribute('border', '1');
	
	let _tr_txt = document.createElement('tr'); //tr +
	
		let _tb_txt = document.createElement('td');
		_tb_txt.setAttribute('colspan', '2');
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
	_div.appendChild(_tbl);

document.getElementById(idEl).appendChild(_div);

}

//****
function createSelCls(divDATA, idPar)
{
let _par = document.getElementById(idPar);
for (let i = 0; i < divDATA.length; i++)
	{
		let _div = document.createElement('DIV');
		_div.innerHTML = divDATA[i]['CLASS_NAME'];
		_div.id = 'CLS_'+divDATA[i]['CLASS_ID'];
		_div.classList.add('listOfUsers');
		_div.setAttribute('name', 'CLS_'+divDATA[i]['CLASS_ID']);			
		
		_par.appendChild(_div);
	}
}
//****
function crtDIV(idPAR, cls, IdPart)
{
let _par = document.getElementById(idPAR);
let _div = document.createElement('DIV');
_div.classList.add(cls);
_div.id = 'ID_CL'+IdPart;
_par.appendChild(_div);
}
//****
function createSelDIV(divDATA, idPar)
{
let _par = document.getElementById(idPar);
for (let i = 0; i < divDATA.length; i++)
	{
		let _div = document.createElement('DIV');
		_div.innerHTML = divDATA[i]['USR'];
		_div.id = divDATA[i]['LOGIN'];
		if(divDATA[i]['STATE'] == 'BLOCKED') //добавим нейм для простоты при выборе "GOOD"
		{
			_div.classList.add('listOfUsers_Bad');
			_div.setAttribute('name', 'BAD_'+divDATA[i]['LOGIN']);
		}
		else 
		{
		_div.classList.add('listOfUsers');
		_div.setAttribute('name', 'GOOD_'+divDATA[i]['LOGIN']);			
		}
		_par.appendChild(_div);
	}
}
//****
function createInput(idPar, idInp)
{
var _inp = document.createElement('input');
_inp.innerHTML = 'введите resource_class';
_inp.id = idInp;
document.getElementById(idPar).appendChild(_inp);
}
//****
function createOption(idPar, optArr)
{
var _par = document.getElementById(idPar);
for(let i=0; i<optArr.length; i++)
{
var option = document.createElement("option");
option.innerHTML = optArr[i]['USR'];
option.id = optArr[i]['LOGIN'];
		if(optArr[i]['STATE'] == 'BLOCKED')
		{
			option.style="background-color: #ff033e;";
		}
option.classList.add('selected');	
_par.appendChild(option);
}
}
//****
function checkRadioBtn()
{
	var scheme = document.getElementsByName("rdbtn");
	//console.log(scheme);
	for(var i = 0; i < scheme.length; i++)
	{
		if (scheme[i].type == "radio" && scheme[i].checked)
		{
			var choise = scheme[i].id;
		}
	}
	return choise;
}
//****
function qntChild(idParDiv)
{
	return document.getElementById(idParDiv).childNodes.length;
}
//****
function callChildtoStr(idParDiv)
{
let oldDiv = document.getElementById(idParDiv).childNodes;
let Arr = [];
let str = '';
if(oldDiv.length != 0)
	{
		for(let i = 0; i < oldDiv.length; i++)
			{
				Arr[i] = oldDiv[i].id;
			}
		str = Arr.join(',');
	}
return str;
}
//****
function createDIV(txtDiv, idEl, idDiv, divClass, divName)
{
var _div = document.createElement('DIV');
_div.innerHTML = txtDiv;
_div.id = idDiv;
_div.classList.add(divClass);
_div.setAttribute('name', divName);
document.getElementById(idEl).appendChild(_div);
}
//****
function createDIVinp(txtDiv, idEl, idDiv, divClass, divName)
{
var _div = document.createElement('DIV');
_div.innerHTML = txtDiv;
_div.id = idDiv;
_div.setAttribute("size", "80");
_div.classList.add(divClass);
_div.setAttribute('name', divName);
document.getElementById(idEl).appendChild(_div);
//
var _inp_cl = document.createElement('input');
_inp_cl.id = 'INP_CLS_'+idDiv;
_inp_cl.setAttribute("size", "38");
_inp_cl.setAttribute("placeholder", "Введите класс");
_inp_cl.setAttribute("type", "hidden");
document.getElementById(_div.id).appendChild(_inp_cl);
//
var _inp_res = document.createElement('input');
_inp_res.id = 'INP_RES_'+idDiv;
_inp_res.setAttribute("size", "38");
_inp_res.setAttribute("placeholder", "Введите ресурс");
_inp_res.setAttribute("type", "hidden");
document.getElementById(_div.id).appendChild(_inp_res);
}
//****

//****
function moveDIV(idDiv, secondPar, newClass)
{
let _secPar = document.getElementById(secondPar);
let _div = document.getElementById(idDiv);
	if(newClass)
	{
	_div.classList.add(newClass);
	}
_secPar.appendChild(_div);
}
//****
function createBttn(nameBtn, idEl, idBtn)
{
var _butt = document.createElement("BUTTON");
_butt.innerHTML = nameBtn;
_butt.id = idBtn;
document.getElementById(idEl).appendChild(_butt);
}

