<html>
	<head>		
			<title>EaaS login</title>		
			<link rel="stylesheet" href="style.css" type="text/css" />
			<link rel="icon" href="favicon_.ico">
<script type="text/javascript" src="./scripts/jquery-3.6.1.min.js"></script>
<script type="text/javascript" src="./scripts/login.js"></script>
	</head> 
	<body style="background-color: #f2f3f7;">
	<table border = '0 px' width="470px" height="100%" align="center" valign="middle">
			<tr height="20%">
				<td width="5px">
					
				</td>		
				<td width="460px">
					
				</td>
				<td width="5px">
					
				</td>
			</tr>
			<tr height="400px">
				<td width="5px">
					
				</td>		
				<td width="460px">
					<table border="0px" width="100%" height="459px" align="center" valign="middle" 
					style="background-color: white; border: 1px solid white; border-radius: 0.5rem;">
						<tr height="70px">
							<td align="middle" valign="bottom">
								<img src="images/mts_id.png" alt="MTS" >
							</td>
						</tr>
						<tr height="70px" valign="center">
							<td align="left">
								<p style="font-family: 'MTSbold'; font-size: 22px; color: rgb(29, 32, 35); margin-left: 40px"/> 
									Введите логин и пароль <br>
									для доступа в EDGE:
								 </p>
							</td>
						</tr>
						<tr height="80px">
							<td align="middle">
								<input maxlength="25" size="10" placeholder="Ваш логин" id="input_login" class="forinput">
							</td>
						</tr>
						<tr height="80px">
							<td align="middle">
								<input maxlength="25" size="10" placeholder="Ваш пароль" id="input_password" type="password" class="forinput">
							</td>
						</tr>						
						<tr>
							<td align="middle" valign="top">
								<input type="button" id="auth_button" value="Войти" class="forbutton">
								<div id="hidden_txt" class="login_err"></div>
							</td>
						</tr>
					</table>
				</td>
				<td width="5px">
					
				</td>
			</tr>
			<tr height="20%">
				<td width="5px">
					
				</td>		
				<td width="460px" align="center" valign="bottom">
					<p style="font-family: 'MTSmain'; font-size: 17px; line-height: 1.95rem; color: rgb(98, 108, 119);"/> 
					© 2022 ПАО «МТС». Все права защищены
					 </p>
				</td>
				<td width="5px">
					
				</td>
			</tr>
	</table>
	</body> 
</html>