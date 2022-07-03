// Javascript for both main category pages and post pages

$(document).ready(function() {

    var category = $("#category").text();
    category = category.replace(category.charAt(0), category.charAt(0).toUpperCase());
    category = category.replace(category.charAt(5), category.charAt(5).toUpperCase());

    if (category) document.title = category + " | DiscoverLAGUNA";

    var location = $("#location").text();
    if (location) {
        document.title = location + " | DiscoverLAGUNA";
        $("#nav-bar").find('a:contains('+location+')').css('text-decoration', 'underline');
    }
    
    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('margin-top', navHeight);

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('.adjust-height').css('margin-top', navHeight);
    })

    // category colors
    switch(category) {
        case "Must-Visits":
            $(".category-name").css('color', '#578E87');
            $(".category-name").prepend('<i class="fa fa-map-marker"></i>');
            $("#navbar-must-visits").css('text-decoration', 'underline');
            break;
        case "Must-Eats":
            $(".category-name").css('color', '#1C4508');
            $(".category-name").prepend('<i class="fa fa-cutlery"></i>');
            $("#navbar-must-eats").css('text-decoration', 'underline');
            break;
        case "Must-Dos":
            $(".category-name").css('color', '#97AA00');
            $(".category-name").prepend('<i class="fa fa-ticket"></i>');
            $("#navbar-must-dos").css('text-decoration', 'underline');
            break;
    }
    
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


    /* -- No-Posts -- */
    var posts = document.getElementsByClassName("post-container");

    if (posts.length == 0) {
        $(".no-posts").removeAttr('hidden');

        switch(category) {
            case "Must-Visits":
                $("#no-posts-icon").prepend('<i class="fa fa-map-marker"></i>');
                break;
            case "Must-Eats":
                $("#no-posts-icon").prepend('<i class="fa fa-cutlery"></i>');
                break;
            case "Must-Dos":
                $("#no-posts-icon").prepend('<i class="fa fa-ticket"></i>');
                break;
        }

        if (category) $(".no-posts-name").text(category);
    }

})