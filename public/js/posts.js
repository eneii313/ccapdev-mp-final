$(document).ready(function() {

    document.title = $(".post-title").text() + " | DiscoverLAGUNA";

    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('margin-top', navHeight);

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('.adjust-height').css('margin-top', navHeight);
    })

    /* -- Highlight Category in NavBar -- */
    const category =  $("#post-category").text();


    $("#post-likes").mouseleave(function() {
        $('#post-likes').tooltip("hide");
    });

    $("#post-likes").hover(function() {
        $('#post-likes').tooltip("show");
    });


    switch(category) {
        case "must-visits":
            $("#navbar-must-visits").css('text-decoration', 'underline');
            break;
        case "must-eats":
            $("#navbar-must-eats").css('text-decoration', 'underline');
            break;
        case "must-dos":
            $("#navbar-must-dos").css('text-decoration', 'underline');
            break;
    }

    function categoryColor () {
        switch(category) {
            case "must-visits":
                return "#578E87";
            case "must-eats":
                return "#1C4508";
            case "must-dos":
                return "#97AA00";
        }
    }

    //if the post is already liked by the user, change like button
    colorPostLike();

    async function colorPostLike() {
        var postId = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);
        var likeBtn = $("#post-likes");

        await $.get('/check-like-post',  {postId: postId} , function(flag) {
            if (flag) {
                likeBtn.css("color",  categoryColor());
            }
        })
    }

    /* -- LIKING THE POST -- */
    $("#post-likes").click(async function() {

        var postId = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);
        var postLikes = $("#post-likes-count").text();
        var postLikesDisplay = $("#post-likes-count");
        var likeBtn = $(this);

        await $.post('/like-post', {postId: postId}, async function (response) {
            if (response.loggedIn) {
                // if a user is logged in, update like button
                await $.get('/check-like-post',  {postId: postId} ,function(flag) {
                    if (flag) {
                        likeBtn.css("color", categoryColor());
                        postLikesDisplay.text(++postLikes);    
                    } 
                    else {
                        likeBtn.css("color", "#000000"); // unlike color
                        postLikesDisplay.text(--postLikes);
                    }
                })
            }
            else {
                window.location.replace(response.loginURL);
            }
        })
    })

    /* --- Image Slider --- */
    $(".owl-carousel").owlCarousel({
        items: 1,
        loop: true,
        nav: true,
        dots: false,
        autoplay: false,
        navSpeed: 1000,
        mouseDrag: false,
    });

    /* -- TAGS -- */
    colorTags();

    function colorTags () {
        var selectedCat = $("#post-category").val();

        if (category == 'must-eats' || selectedCat == 'must-eats')
            $('.tags').children('ul').children('li').css('background-color', "#1C4508");
        else if (category == 'must-visits' || selectedCat == 'must-visits')
            $('.tags').children('ul').children('li').css('background-color', "#578E87");
        else if (category == 'must-dos' || selectedCat == 'must-dos')
            $('.tags').children('ul').children('li').css('background-color', "#97AA00");
    }

    var tags = document.getElementsByClassName("tags");
    tags = $(tags).children("ul").children("li");
    if (tags.length > 0)
        $(".no-tags").hide();
    

    /* --- Comment Section --- */
    colorCommentBtn();

    function colorCommentBtn () {
        if (category == 'must-eats'){
            $('.comment-btn').css('background-color', "#1C4508");
            $('.reply-submit-btn').css('background-color', "#1C4508");
        }
        else if (category == 'must-visits'){
            $('.comment-btn').css('background-color', "#578E87");
            $('.reply-submit-btn').css('background-color', "#578E87");
        }
        else if (category == 'must-dos'){
            $('.comment-btn').css('background-color', "#97AA00");
            $('.reply-submit-btn').css('background-color', "#97AA00");
        }
    }

    $("#addCommentDescription").keyup(function() {
        if($.trim($(this).val()) != "")
            $("#comment").prop('disabled', false);
        else $("#comment").prop('disabled', true);
    })

    $("#comment").click(function() {

        var comment = {
            cDescription: $("#addCommentDescription").val(),
            cPostId: $("#addCommentPostId").val()
        }

        $.post('/comment', comment, function(commentCard) {
            if(commentCard){
                $("#addCommentDescription").val("");
                $("#comment").prop('disabled', true);
                $("#comment-br").after(commentCard);
                $(".no-comments").hide();
            }
        })

    })


    /* --- Edit Comment --- */

    $(".comment-section").on('click', ".edit-btn", function() {
        $(this).parent().hide();
        $(this).parent().siblings(".comment-description").hide();
        $(this).parent().siblings(".edit-comment").attr("hidden", false);
        $(this).parent().siblings(".edit-comment").find("textarea").val( $(this).parent().siblings(".comment-description").text() );
    })


    // CANCEL EDIT
    $(".comment-section").on('click', ".edit-cancel", function() {
        $(this).parent().parent().attr("hidden", true);
        $(this).parent().parent().siblings(".comment-description").show();
        $(this).parent().siblings("textarea").val( $(this).parent().parent().siblings(".comment-description").text() );
        $(this).parent().parent().siblings(".comment-options").show();
    })

    // SAVE EDITED COMMENT
    $(".comment-section").on('click', ".edit-save", function() {

        var commentId = $(this).siblings(".comment-id").text();
        var cDescription = $(this).parent().siblings("textarea").val();

        // DOM ELEMENTS TO BE UPDATED
        var editForm = $(this).parent().parent();
        var formSiblings = $(this).parent();

        $.post('/update-comment', {
            commentId: commentId,
            cDescription: cDescription
        },
        function(flag) {
            if (flag) {
                editForm.attr("hidden", true);
                editForm.siblings(".comment-description").show();
                editForm.siblings(".comment-description").text(cDescription);
                editForm.siblings(".comment-options").show();

                if (!editForm.parent().parent().find(".date").text().includes('edited'))
                    editForm.parent().parent().find(".date").append(" (edited)");
                formSiblings.siblings("textarea").val("");
            }
        })
    })

    // DELETE COMMENT
    $(".comment-section").on('click', ".edit-delete", function() {
        $("#deleted-comment-content").text('"' + $(this).parent().siblings("textarea").val() + '"');
        $("#deleted-comment-id").text($(this).siblings(".comment-id").text());
    })

    $(".comment-section").on('click', ".edit-delete", function() {
        $("#deleted-comment-content").text('"' + $(this).parent().siblings("textarea").val() + '"');
        $("#deleted-comment-id").text($(this).siblings(".comment-id").text());
    })

    $("#delete-cancel").click(function() {
        $("#deleted-comment-content").text("");
        $("#deleted-comment-id").text("");
    })

    $("#delete-confirm").click(function() {
        
        var commentId = $("#deleted-comment-id").text();

        $.post('/delete-comment', {commentId: commentId}, function(flag) {
            if (flag) {
                $("#deleted-comment-content").text("");
                $("#deleted-comment-id").text("");
                $('span:contains('+commentId+')').parent().parent().parent().parent().remove();
            }
        });
    })

    //for each comment that are already liked by the user, change like button
    var comments = document.getElementsByClassName("comment-options");

    async function colorComments() {
        for (var i = 0; i < comments.length; i++) {
            var cId = $(comments[i]).find(".comment-id").text();
            var cBtn = $(comments[i]).find(".comment-likes");

            await $.get('/check-like-comment',  {cId: cId} , function(flag) {
                if (flag) {
                    cBtn.css("color", categoryColor()); // like color
                }
            })
        }
    }

    colorComments();

    /* -- LIKING COMMENTS -- */
    $(".comment-likes").click(async function() {

        var cId = $(this).siblings(".comment-id").text();
        var cLikes = $(this).children(".comment-likes-count").text();
        var cLikesDisplay = $(this).children(".comment-likes-count");
        var likeBtn = $(this);

        await $.post('/like-comment', {cId: cId}, async function (response) {
            if (response.loggedIn) {
                // if a user is logged in, update like button
                await $.get('/check-like-comment',  {cId: cId} ,function(flag) {
                    if (flag) {
                        likeBtn.css("color", categoryColor());
                        cLikesDisplay.text(++cLikes);
                    } 
                    else {
                        likeBtn.css("color", "#000000"); // unlike color
                        cLikesDisplay.text(--cLikes);
                    }
                })
            }
            else {
                window.location.replace(response.loginURL);
            }
        })
    })

})