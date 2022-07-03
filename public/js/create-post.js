$(document).ready(function() {

    document.title = "Create New Post | DiscoverLAGUNA";

    var navHeight = document.getElementById('nav-bar').offsetHeight;
    $('.adjust-height').css('margin-top', navHeight);

    $(window).resize(function() {
        var navHeight = document.getElementById('nav-bar').offsetHeight;
        $('.adjust-height').css('margin-top', navHeight);
    });

        $(".post-price").hide();
        $(".post-time").hide();
    
        var priceCheck = false;
        var timeCheck = false;
    
        $("#checkPrice").click(function() {
            if (priceCheck === true){
                $(".post-price").hide();
                priceCheck = false;
            }
            else {
                $(".post-price").show();
                priceCheck = true;
            }
        });
    
        $("#checkTime").click(function() {
            if (timeCheck === true){
                $(".post-time").hide();
                timeCheck = false;
            }
            else {
                $(".post-time").show();
                timeCheck = true;
            }
        });
    
        /* -- Uploading Images -- */
        const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];

        //add a image container for a single image file
        $("#label-image").click(function() {
            var imageContainer = $( "<div class=image-div>" +
                                    "<div class=image-container><div class=delete-img>x</div></div>" +
                                    "<input type=file accept=image/* class=upload-image name=postImages></input>" +
                                    "</div>");
            $("#image-display").append(imageContainer);
        });

        $("#label-image").click(function() {
            $('#image-upload').css("border-color", "dimgray");
        });

        $(".post-container").on('click', '.upload-image', function()  {
            $('#image-upload').css("border-color", "dimgray");
        });

        var images = []; //holds the image file names that are currently previewed

        $(".post-container").on('change', '.upload-image', function() {
            var preview = $(this).siblings(".image-container");
            var file = this.files[0];

            if(!checkValidType(file)){
                alert(file.name + " is not a valid image type");
                $(this).val('');
            } 
            else if(checkDuplicate(file.name)){
                images.push(file.name);
                var url = URL.createObjectURL(file);
                preview.prepend( "<img src="+url+" alt="+file.name+">");
            }
            else {
                alert(file.name + " is already added");
                $(this).val('');
            }
        })

        function checkDuplicate(name){
            if (images.length > 0 && name.length > 0){
                for (var i =0; i < images.length; i++){
                    if(images[i] === name)
                        return false;
                }
            }
            return true;
        }

        function checkValidType(image) {
            var fileType = image["type"];
            if ($.inArray(fileType, validImageTypes) < 0)
                return false;
            return true;
        }
    
        /* -- Deleting An Image -- */
        $(".post-container").on('click', '.delete-img', function() {
            var image = $(this).siblings("img").attr("alt");
            if (image !== null){
                console.log("Removing " + images.indexOf(image));
                images.splice(images.indexOf(image), 1); 
                $(this).parent().parent().remove();
            }
            validatePost();
        });
    
        /* -- Adding New Tags -- */
        var newTags = [];

        colorTags();

        function colorTags () {
            var selectedCat = $("#post-category").val();
            switch(selectedCat) {
                case 'must-eats':
                    $('.tags').children('ul').children('li').css('background-color', "#1C4508");
                    break;
                case 'must-visits':
                    $('.tags').children('ul').children('li').css('background-color', "#578E87");
                    break;
                case 'must-dos':
                    $('.tags').children('ul').children('li').css('background-color', "#97AA00");
                    break;             
            }
        }

        $('#input-tag-error').hide();
    
        $('#input-tag').keyup(function() {
            $('#input-tag-error').hide();
            $('#input-tag').css("border", "1px solid #CED4DA");
        })
    
        $("#add-tag").on('click', function() {
            if ($("#input-tag").val().length > 0){
                let foundTag = false;
                var i = 0;
    
                for (i = 0; i < newTags.length; i++){
                    if (newTags[i] === $("#input-tag").val().toLowerCase()){
                        foundTag = true;
                        break;
                    }
                }
                
                if (foundTag == false){
                    newTags.push($("#input-tag").val().toLowerCase());
                    $(".tags ul").append("<li class=new-tag>"+ $("#input-tag").val().toLowerCase() +"</li>");
                    $("#input-tag").val("");
                    colorTags();
                    addPopoverToTags();
                }
                else {
                    $('#input-tag').css("border", "1px solid #AD0000");
                    $('#input-tag-error').show();
                }
            }
        })
    
        $("#post-category").on("change", function() {
            colorTags();
        })
    
        addPopoverToTags();
    
        function addPopoverToTags() {
            $(".new-tag").attr("data-toggle", "tooltip");
            $(".new-tag").attr("data-trigger", "focus");
            $(".new-tag").attr("data-placement", "top");
            $(".new-tag").attr("title", "Click to remove tag");
        }
    
        $(".post-container").on('mouseenter', '.new-tag', function() {
            $(this).append(" x");
            $(this).tooltip("show");
            $(this).css("cursor", "pointer");
        })
    
        $(".post-container").on('mouseleave', '.new-tag', function()  {
            var tagName = $(this).text().split(" x").join("");
            $(this).text(tagName);
        })
    
        /* -- Removing a Tag -- */
        $(".post-container").on('click', '.new-tag', function() {
            newTags.splice($.inArray($(this).val(), newTags), 1);
            $(this).tooltip("hide");
            $(this).remove();
        })


        /* -- Submitting a Post -- */
        $("#new-post").change(function() {
            validatePost();
        });
        
        $("#post-desc").keyup(function() {
            validatePost();
        });

        $("#post-title").keyup(function() {
            validatePost();
        });

        $("input").keyup(function() {
            validatePost();
        })

        $("#add-tag").click(function() {
            validatePost();
        })

        function validatePost() {
            var valid = true;

            if(!validateTitle()){
                valid = false;
            }

            if(images.length < 1){
                valid = false;
            }

            if(!validateDesc()){
                valid = false;
            }

            if(priceCheck && !validatePrice()){
                valid = false;
            }

            if(timeCheck && !validateTime()){
                valid = false;
            }
                
            //if any of the above are missing, alert the user of the missing parts
            if (!valid){
                $("#post-submit").prop('disabled', true);
            }
            else {
                //if the optional details are not checked, remove their values
                if (!priceCheck){
                    $("#post-price-min").val('');
                    $("#post-price-max").val('');
                }
                if (!timeCheck){
                    $("#post-time-min").val('');
                    $("#post-time-max").val('');
                }

                $("#post-submit").prop('disabled', false);

            }

            
        };

        $("#new-post").submit(function() {
            //clear all image containers w/o a file
            var imageContainers = document.getElementsByClassName("upload-image");
            for (var i = 0; i < imageContainers.length; i++){
                if (imageContainers[i].files.length == 0)
                    $(imageContainers[i]).parent().remove();
            }
            //add all tags as hidden inputs
            for (var i = 0; i < newTags.length; i++){
                let tagInput = $("<input type=hidden name=postTags>");
                tagInput.val(newTags[i]);
                $("#new-post").append(tagInput);
            }
        })


        function validateTitle() {
            var titleInput = $.trim($('#post-title').val());
            return titleInput !== '';
        }

        $('#post-title').keyup(function() {
            $('#post-title').css("border-color", "#CED4DA");
        })

        function imageError() {
            $('#image-upload').css("border-color", "#AD0000");
            alert("Please add at least one image!");
        }

        function validateDesc() {
            var descInput = $.trim($('#post-desc').val());
            return descInput !== '';
        }

        $('#post-desc').keyup(function() {
            $('#post-desc').css("border-color", "#CED4DA");
        })

        function validatePrice() {
            var minPrice = parseInt($("#post-price-min").val());
            var maxPrice = parseInt($("#post-price-max").val());

            if(isNaN(minPrice))
                return false; //no min price
            else if (!isNaN(maxPrice) && maxPrice <= minPrice)
                return false; //max val is less than min val

            return true;
        }

        $('#post-price-min').keyup(function() {
            $('#post-price-min').css("border-color", "#CED4DA");
        })

        function validateTime() {
            if($("#post-time-min").val() === '')
                return false; //no start time
            else if ($("#post-time-max").val() !== '' && $("#post-time-max").val() <= $("#post-time-min").val())
                return false;
            return true;
        }

        $('#post-time-min').change(function() {
            $('#post-time-min').css("border-color", "#CED4DA");
        })
}) 