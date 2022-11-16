$(document).ready(function(){

    $("#auth_button").click(function() {

        var errorDiv = document.getElementById("hidden_txt");
        errorDiv.innerHTML = '';

        var name = $('#input_name').val();
        var surname = $('#input_surname').val();
        var second_name = $('#input_second_name').val();


        if(name == "" || surname == "" || second_name == "")
        {
            errorDiv.innerHTML = 'Введите фамилию/имя/отчество!';
        }
        else if(!$('#scales').is(':checked')){
            errorDiv.innerHTML = 'Согласитесь с политикой безопасности!';
        }
        else
        {
            $.ajax({
            type:"POST",
            url: "./core/engine.php",
            dataType: "json",
            data: {
                action: "postAuth",
                name: name,
                surname: surname,
                second_name: second_name
                },
            success: function(data) 
                {
                    console.log(data);
                    document.getElementById("input_surname").innerHTML = '';
                }
            });
        }
    });
});