window.onload = function (){
    $.get("../view/navbar.html", function(data){
        $("#donavbar").replaceWith(data);
    });
}