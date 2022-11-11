//17.12.2019
$(document).ready(function(){
	
	$("#input_password").keyup(function(event) {
		if (event.keyCode === 13) {
			$("#auth_button").click();
		}
	});
	
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
						window.open('http://10.0.69.118/index.php', '_self', false);
						
					}
				}
			});
		}
		
	});
	
	
});