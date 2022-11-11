//17.12.2019
$(document).ready(function(){
	
	
	// сначала - извлечем токен из localStorage!
	var token = localStorage.getItem('MANOtokenID');
	var mainDiv = document.getElementById("main_div");
	console.log(token);

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
				mainDiv.innerHTML = 'У вас пока нет сервисов :( Предлагаем создать!';
			}
			else{
				console.log('сервисов '+data.length+'!');
				// здесь функция (она же на дашборде), генерящая DIV с инстансами!
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