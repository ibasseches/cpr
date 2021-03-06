function add_user(new_user){
    $.ajax({
        type: "POST",
        url: "add_user",                
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(new_user),
        success: function(result){
            console.log(result["userID"])
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)
        }
    });
}

function check_name(name){
    let nameTrim = name.trim()

    if (nameTrim.length == 0){
        return false;
    } else{
        return true;
    }
}

$(document).ready(function(){
    
    $("#homenav").addClass("active");
    for (i = 1; i < 7; i++) {
        let linkname = "#nav-link" + i;
        console.log(linkname)
        $(linkname).addClass("disabled");
    }

    document.getElementById("search").disabled = true;
    document.getElementById("submit").disabled = true;
    
    $("#userName").focus()

    $("#startCPRBtn").click(function() {
        let user = {
            "name": userName.value
        }

        let nameValid = check_name(userName.value);

        if (nameValid){
            add_user(user)
            window.location.href = "/learn/1"
        } else{
            $("#nameCheck").text("Please enter your name above")
            $("#nameCheck").addClass("tinyTopPadding")
        }

    });

    $("#userName").keyup(function(event){
        let keycode = (event.keyCode ? event.keyCode : event.which);

        if(keycode == '13'){
            let user = {
                "name": userName.value
            }

            let nameValid = check_name(userName.value);

            if (nameValid){
                add_user(user)
                window.location.href = "/learn/1"
            } else{
                $("#nameCheck").text("Please enter your name above")
                $("#nameCheck").addClass("tinyTopPadding")
            }
        };

        event.stopPropagation();
    });

})