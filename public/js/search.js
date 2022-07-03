$(document).ready(function() {

    document.title = "Search | DiscoverLAGUNA";

    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('margin-top', navHeight);

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('.adjust-height').css('margin-top', navHeight);
    })

    var posts = document.getElementsByClassName("post-container");

    for (var i = 0; i < posts.length; i++){
        var category = $(posts[i]).children(".post-category").text();

        switch(category) {
            case "must-visits":
                $(posts[i]).find(".post-title").prepend('<i class="fa fa-map-marker"></i> ');
                $(posts[i]).find(".post-icons").css("color", '#578E87');
                break;
            case "must-eats":
                $(posts[i]).find(".post-title").prepend('<i class="fa fa-cutlery"></i> ');
                $(posts[i]).find(".post-icons").css("color", '#1C4508');
                break;
            case "must-dos":
                $(posts[i]).find(".post-title").prepend('<i class="fa fa-ticket"></i> ');
                $(posts[i]).find(".post-icons").css("color", '#97AA00');
                break;
        }
    }

    /* -- No-Results -- */
    var results = document.getElementsByClassName("result");

    if (results.length > 0)
        $(".no-posts").hide();

})