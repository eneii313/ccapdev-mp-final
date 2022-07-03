$(document).ready (function () {

    document.title = "Create Profile | DiscoverLAGUNA";

    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('margin-top', navHeight);

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('.adjust-height').css('margin-top', navHeight);
    })

    
    var validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];

    // when a file is uploaded, preview image as profile pic
    $("#upload-avatar").on('change', function() {
        var image = this.files[0];

        if (image) {
            var fileType = image["type"];
            if ($.inArray(fileType, validImageTypes) < 0) {
                var error = "<div class='lead img-error align-self-center'>Invalid file type. Please choose an image file for your profile avatar.</div>";
                $(".avatar").after(error);
                $(".avatar").attr("src", "images/avatar-default.jpg");
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
            $(".avatar").attr("src", "images/avatar-default.jpg");
        }

    })

});