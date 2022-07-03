$(document).ready(function() {

    document.title = "Account Settings | DiscoverLAGUNA";

    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('margin-top', navHeight);

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('.adjust-height').css('margin-top', navHeight);
    });

    const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];
    const imageName = $("#avatar-pic").attr('src');

    // when a file is uploaded, preview image as profile pic
    $("#upload-avatar").on('change', function() {
        var image = this.files[0];

        if (image) {
            var fileType = image["type"];
            if ($.inArray(fileType, validImageTypes) < 0) {
                var error = "<div class='lead img-error align-self-center'>Invalid file type. Please choose an image file for your profile avatar.</div>";
                $(".avatar").after(error);
                $(".avatar").attr("src", imageName);
                $("#upload-avatar").val("");
            } else {
                var reader = new FileReader();
        
                reader.onload = function () {
                    $(".img-error").remove();
                    $(".avatar").attr("src", this.result);
                }
                    
                reader.readAsDataURL(image);
            }
        } else {
            $(".avatar").attr("src", imageName);
        }

    })
    

    // $("#checkPassword").click(function() {
    //     $('#password-settings').slideToggle(350, "swing");
    // });

    $('#delete-modal').on('shown.bs.modal', function () {
        $('#delete').trigger('focus');
    });

    $('input:password').keyup(function() {
        checkPassword();
    })

    $('#understand').click(function() {
        checkPassword();
    })


    function checkPassword() {
        if ($("#password").val() != "" && $("#confirm-password").val() != "" && $("#understand").is(':checked')){

            var password = $("#password").val();
            var confirm = $("#confirm-password").val();
            var username =  $("#password-username").val();
            
            var verification = {
                username : username,
                password: password,
                confirm: confirm
            }

            $.post('/verifyPassword', verification, function(result) {
                if (result) {
                    $("#error-password").text("* " + result.passError);
                    $("#password").css("border", "1px solid #AD0000");
                }
                else {
                    $("#error-password").text("");
                    $("#password").css("border", "1px solid #CED4DA");

                    if (password !== confirm){
                        $("#error-confirm-password").text("* Password doesn't match");
                        $("#confirm-password").css("border", "1px solid #AD0000");
                        $("#delete-confirm").prop('disabled', true);
                    }
                    else {
                        $("#error-confirm-password").text("");
                        $("#confirm-password").css("border", "1px solid #CED4DA");
                        $("#delete-confirm").prop('disabled', false);
                    }
                }
            })  


        }
        else {
            $("#delete-confirm").prop('disabled', true);
        }
    }

})