$(document).ready(function () {

    $("body").attr('id', 'login-page');

    document.title = "Login | DiscoverLAGUNA";

    // for each keyup, check if both fields have value
    // if true, then enable login button
    $("form input").keyup(function() {

        if ($("#login-username").val().length > 0 && $("#login-password").val().length > 0) {
            $("#login-submit").prop('disabled', false);
        }
        else {
            $("#login-submit").prop('disabled', true);
        }
    })

    if($("#error-login-username").text() != "")
        $("#login-username").css("border", "1px solid #AD0000");

    if($("#error-login-password").text() != "")
        $("#login-password").css("border", "1px solid #AD0000");

    $("#login-username").keyup(function() {
        $('#error-login-username').text(""); 
        $('#login-username').css("border", "1px solid #CED4DA");
    })
    
    $("#login-password").keyup(function() {
        $('#error-login-password').text(""); 
        $('#login-password').css("border", "1px solid #CED4DA");
    })

})