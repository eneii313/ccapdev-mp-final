$(document).ready(function() {

    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('top', navHeight);

    $('#explore-btn').click(function() {
        navHeight = document.getElementById('nav-bar').offsetHeight;
        $('#explore-bar').css('top', navHeight);    
        $('#explore-bar').slideToggle(350, "swing");
        if($('#user-bar').is(':visible'))
        $('#user-bar').slideToggle(350, "swing");
    })

    $('#user-btn').click(function() {
        navHeight = document.getElementById('nav-bar').offsetHeight;
        $('#user-bar').css('top', navHeight);    
        $('#user-bar').slideToggle(350, "swing");
        if ($('#explore-bar').is(':visible'))
            $('#explore-bar').slideToggle(350, "swing");
    })

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('#explore-bar').css('top', navHeight); 
        $('.adjust-height').css('top', navHeight);
        $('#user-bar').css('top', navHeight); 
    })

    $(document).mouseup(function (e) {
        if ($(e.target).closest("#explore-bar").length === 0
            && $(e.target).closest("#nav-bar").length === 0
            && $('#explore-bar').is(':visible')) {
            $('#explore-bar').slideToggle(350, "swing");
        }
        
        if ($(e.target).closest("#user-bar").length === 0
            && $(e.target).closest("#nav-bar").length === 0
            && $('#user-bar').is(':visible')) {
            $('#user-bar').slideToggle(350, "swing");
        }
    })

    $('.to-top').click(function() {
        $('html, body').scrollTop(0);
    });

})