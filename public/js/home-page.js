$(document).ready(function () {

    document.title = "DiscoverLAGUNA";

    $("#must-visits-carousel").owlCarousel({
        items: 3,
        loop: false,
        margin: 10,
        nav: true,
        navText:["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
        slideBy: 3,
        dots: false,
        mouseDrag: false
    })

    $("#must-eats-carousel").owlCarousel({
        items: 3,
        loop: false,
        margin: 10,
        nav: true,
        navText:["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
        slideBy: 3,
        dots: false,
        mouseDrag: false
    })

    $("#must-dos-carousel").owlCarousel({
        items: 3,
        loop: false,
        margin: 10,
        nav: true,
        navText:["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
        slideBy: 3,
        dots: false,
        mouseDrag: false
    })


    resize_post_titles();

    function resize_post_titles() {
        var postTitles = document.getElementsByClassName("post-title");
        var i;

        for (i = 0; i<postTitles.length; i++){
            while ($(postTitles[i]).height() > 60){
                var fontSize = $(postTitles[i]).css("font-size");
                $(postTitles[i]).css("font-size", parseInt(fontSize) - 1);
            }
        }
    }

    //for each posts that are already liked by the user, change like button
    var posts = document.getElementsByClassName("post-form");

    async function colorLikes() {
        for (var i = 0; i < posts.length; i++) {
            var postId = $(posts[i]).find(".post-id").val();
            var formBtn = $(posts[i]).find(".post-likes");

            await $.get('/check-like-post',  {postId: postId} , function(flag) {
                if (flag) {
                    formBtn.css("color", "#912A4B"); // like color
                }
            })
        }
    }

    colorLikes();
    

    // LIKE BUTTONS
    $(".post-form").submit(function(e) {

        e.preventDefault();

        var postId = $(this).find(".post-id").val();
        var formBtn = $(this).find(".post-likes");
        var formLikes = $(this).find(".post-likes-count");
        var postLikes = $(this).find(".post-likes-count").text();
        var category = $(this).parents(".owl-carousel").attr("id");


        // call like post function to update db
        $.post('/like-post', {postId: postId}, function (response) {
            if (response.loggedIn) {
                // if a user is logged in, update like button
                $.get('/check-like-post',  {postId: postId} ,function(flag) {
                    if (flag) {
                        formBtn.css("color", "#912A4B"); // like color
                        formLikes.text(++postLikes);
                    } 
                    else {
                        switch(category) {
                            case "must-visits-carousel":
                                formBtn.css("color", "#578E87");
                                break;
                            case "must-eats-carousel":
                                formBtn.css("color", "#1C4508");
                                break;
                            case "must-dos-carousel":
                                formBtn.css("color", "#97AA00");
                                break;
                        }
                        formLikes.text(--postLikes);                     
                    }
                })
            }
            else {
                window.location.replace(response.loginURL);
            }
        })

    })
})