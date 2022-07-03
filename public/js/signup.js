$(document).ready(function() {

    $("body").attr('id', 'sign-up-page');

    document.title = "Sign Up | DiscoverLAGUNA";

    // for each keyup, check if email exists
    $('#sign-up-email').keyup(function() {

        $("#sign-up-submit").prop('disabled', true);

        let emailInput = $.trim($('#sign-up-email').val());
        $.get('/checkEmail', {email: emailInput}, function (result) {
            if(result.email == emailInput){
                $('#error-sign-up-email').text("*E-mail is already registered");
                $('#sign-up-email').css("border", "1px solid #AD0000");
            }
                
            else {
                $('#sign-up-email').css("border", "1px solid #CED4DA");
                $('#error-sign-up-email').text("");
            }
        });
    })

    //check format of email
    $('#sign-up-email').blur(function() {
        var error = validateEmail();
        if (error)
            $("#sign-up-submit").prop('disabled', true);
        else checkValid();
    })
    
    
    //check if the email input is valid (format-wise)
    //return true if there is an error, false otherwise
    function validateEmail() {
        let emailInput = $.trim($('#sign-up-email').val());
        if (emailInput === '') {
            $('#error-sign-up-email').text("*E-mail is missing");
            $('#sign-up-email').css("border", "1px solid #AD0000");
            return true;
        }
        else if (isEmail(emailInput) == false) {
            $('#error-sign-up-email').text("*Invalid e-mail");
            $('#sign-up-email').css("border", "1px solid #AD0000");
           return true;
        }
        else return false;
    }

    function isEmail(email){
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!regex.test(email)) return false;
        else return true;
    }


    // for each keyup, check if username exists
    $('#sign-up-username').keyup(function() {

        $("#sign-up-submit").prop('disabled', true);

        let nameInput = $.trim($('#sign-up-username').val());
        $.get('/checkUsername', {username: nameInput}, function (result) {
            if(result.username == nameInput){
                $('#error-sign-up-username').text("*Username already exists");
                $('#sign-up-username').css("border", "1px solid #AD0000");
            }
                
            else {
                $('#sign-up-username').css("border", "1px solid #CED4DA");
                $('#error-sign-up-username').text("");
            }
        });
    })

    //check format of username
    $('#sign-up-username').blur(function() {
        var error = validateName();
        if (error)
            $("#sign-up-submit").prop('disabled', true);
        else checkValid();
    })

    //check if the username input is valid (format-wise)
    //return true if there is an error, false otherwise
    function validateName() {
        let nameInput = $.trim($('#sign-up-username').val());
        if (nameInput === '') {
            $('#error-sign-up-username').text("*Username is missing");
            $('#sign-up-username').css("border", "1px solid #AD0000");
            return true;
        }
        else if (nameInput.length < 4){
            $('#error-sign-up-username').text("*Username must be at least 4 characters long");
            $('#sign-up-username').css("border", "1px solid #AD0000");
            return true;
        }
        else if (nameInput.indexOf(' ')>=0){
            $('#error-sign-up-username').text("*Username must not contains spaces");
            $('#sign-up-username').css("border", "1px solid #AD0000");
            return true;
        }
        else return false;
        
    }
    
    $('#sign-up-password').keyup(function() {

        $("#sign-up-submit").prop('disabled', true);

        $('#error-sign-up-password').text(""); 
        $('#sign-up-password').css("border", "1px solid #CED4DA");
        $('#error-sign-up-confirm').text("");
        $('#sign-up-confirm').css("border", "1px solid #CED4DA");
    })

    $('#sign-up-password').blur(function() {
        var error = validatePassword();
        if (error)
            $("#sign-up-submit").prop('disabled', true);
        else {
            error = validateConfirm();
            if (error)
                $("#sign-up-submit").prop('disabled', true);
            else checkValid();
        }
    });

    $('#sign-up-confirm').blur(function() {
        var error = validateConfirm();
        if (error)
            $("#sign-up-submit").prop('disabled', true);
        else checkValid();

    });

    // check if the password is valid
    //return true if there is an error, false otherwise
    function validatePassword() {
        let passwordInput = $('#sign-up-password').val();
        if (passwordInput === '') {
            $('#error-sign-up-password').text("*Password is missing");
            $('#sign-up-password').css("border", "1px solid #AD0000");
            return true;
        }
        else if (passwordInput.length < 4){
            $('#error-sign-up-password').text("*must be at least 4 chars");
            $('#sign-up-password').css("border", "1px solid #AD0000");
            return true;
        }
        else {
            $('#sign-up-password').css("border", "1px solid #CED4DA");
            $('#error-sign-up-password').text(""); 
            return false;
        }
    }
    

    $('#sign-up-confirm').keyup(function() {

        $("#sign-up-submit").prop('disabled', true);

        $('#error-sign-up-confirm').text(""); 
        $('#sign-up-confirm').css("border", "1px solid #CED4DA");
    })

    // check if the password confirmation is valid
    // return true if there is an error, false otherwise
    function validateConfirm() {
        let confirmInput = $('#sign-up-confirm').val();
        let passwordInput = $('#sign-up-password').val();

        if (passwordInput === ""){
            $('#sign-up-password').css("border", "1px solid #CED4DA");
            $('#error-sign-up-password').text("");
            return false; 
        }          
        else if (confirmInput === '') {
            $('#error-sign-up-confirm').text("*Confirmation is missing");
            $('#sign-up-confirm').css("border", "1px solid #AD0000");
            return true;
        }
        else if (confirmInput !== passwordInput) {
            $('#error-sign-up-confirm').text("*Password doesn't match");
            $('#sign-up-confirm').css("border", "1px solid #AD0000");
            return true;
        }
        else {
            $('#sign-up-confirm').css("border", "1px solid #CED4DA");
            $('#error-sign-up-confirm').text(""); 
            return false;
        }
    }

    function checkValid() {
        
        var valid = true;

        if ($('#sign-up-email').val() == "" || $('#sign-up-username').val() == "" 
            || $('#sign-up-password').val() == "" || $('#sign-up-confirm').val() == "")
            valid = false;
        else {
            var errors = document.getElementsByClassName('error');
            for (var i = 0; i< errors.length; i++){
                if ($(errors[i]).text() !== ""){
                    valid = false;
                    break;
                }
            }
        }

        if(valid)
            $("#sign-up-submit").prop('disabled', false);

    }
})