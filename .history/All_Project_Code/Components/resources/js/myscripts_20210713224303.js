$(".btnmodal").on('click',function(){
  //console.log($(this).attr('data-content'))
  let data_content = $(this).attr('data-content').toString()
  modal_arr = data_content.split('&')
  console.log(modal_arr)
  //console.log(data_content)
  let temp_title
  let temp_full_desc = $(this).attr('')
  var str = $('.modal-title').html()
  console.log(str.includes(modal_arr[0]))
  if(!str.includes(modal_arr[0])){
    $(".modal-title").empty()
    $(".print_info").empty()
    $(".modal-title").html(modal_arr[0]);
    //console.log(modal_arr)
    //$(".comment_box").find('.neededID').val('2132')
    //console.log(document.getElementsByClassName('neededID').val);
    //console.log("id,", $(".comment_box").find('.neededID').val())
    $("#modal_id").val(modal_arr[modal_arr.length-1] + '&' + modal_arr[modal_arr.length-2])
    //$(".print_info").prepend('<input type="hidden" class="neededId" name="id" value="'+modal_arr[modal_arr.length-1] + '&' + modal_arr[modal_arr.length-2]+'"></input>')
    if(modal_arr.length == 2){
      $(".print_info").prepend("<h4>" + modal_arr[1]+"</h4>");
    }else{
      $(".print_info").prepend("<h5>" + modal_arr[2]+"</h5>");
      $(".print_info").prepend("<h4>" + modal_arr[1]+"</h4><br>");
    }
  }
  modal_arr = []
  $("#myModal").modal('show');
});

$(function(){
  $('#comment_box').on('submit', function(data){
    data.preventDefault();
    $.ajax({
      url: '../../server.js',
      method: 'post',
      data: ('#comment_box').serialize(),
      success: function(){
        console.log("success")
      }
    })
  })
})


function validateForm() {
  if (!checkUsernameAvail()) {
    alert("The username that you selected is already in use");
    return false;
  }
  if (!checkPasswordMatch()) {
    alert("The passwords that you entered do not match");
    return false;
  }
}

function checkUsernameAvail() {
  var userString = document.getElementById("currUsers").innerHTML;
  var userArray = userString.split(",");
  var userInput = document.getElementById("username");
  if (userArray.includes(userInput.value)) {
    userInput.style.borderColor = "red";
    userInput.style.borderWidth = "medium";
    userInput.setCustomValidity = "Username already in use; please choose another :)";
    return false;
  }
  else {
    userInput.style.borderColor = "green";
    userInput.style.borderWidth = "medium";
    return true;
  }
}

function checkPasswordMatch() {
  var pass1 = document.getElementById("password");
  var pass2 = document.getElementById("passwordConfirm");
  if (pass1.value === pass2.value) {
    pass2.style.borderColor = "green";
    pass2.style.borderWidth = "medium";
    return true;
  }
  else{
    pass2.style.borderColor = "red";
    pass2.style.borderWidth = "medium";
    pass2.setCustomValidity = "Passwords must match";
    return false;
  }
}

$("#downbtn").click(function(){
  createICSfile();
})

var icsFile = null;

function createICSfile(){
    let str =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//Test Cal//EN\n" +
      "VERSION:2.0\n" +
        "BEGIN:VTIMEZONE\n"+
        "TZID:America/Denver\n" +
    "TZURL:http://tzurl.org/zoneinfo-outlook/America/Denver\n"+
        "X-LIC-LOCATION:America/Denver\n" +
    "BEGIN:STANDARD\n" +
    "TZNAME:MST\n" +
    "TZOFFSETFROM:-0600\n" +
    "TZOFFSETTO:-0700\n" +
    "DTSTART:19700101T000000\n" +
    "END:STANDARD\n" +
    "END:VTIMEZONE\n" + 
     // //console.log(event_str)
     "BEGIN:VEVENT\n" +
     "UID:" +
         Math.random().toString(36).substring(2) +

     "\n" + 
     "DTSTART;" + "TZID=America/Denver:" +
     "20210802" + "T" + "0008000" +
     "\n" +
     "DTEND;" + "TZID=America/Denver:" +
     "20210802" + "T" + "235959" +
     "\n" +
         "TZID:America/Denver\n" +
     "SUMMARY:" +
      "review for " + "djasdasd" +
     "\n" +
     "DESCRIPTION:" + "review for "+ "dasdasd" +
     "\n" +
     "BEGIN:VALARM\n" +                                                                       
     "TRIGGER:-PT10M\n" +
     "ACTION:DISPLAY\n" +
         "DESCRIPTION:Reminder\n" +
         "END:VALARM\n" +
        // "\n" +
     //"RRULE: FREQ=WEEKLY; WKST=SUN; BYDAY= " + r_week + //"EXDATE="+ exclude_str +
     //"\n" +
     "END:VEVENT\n"; +

       "END:VCALENDAR";
       console.log(str)
      //console.log("test cal\n", test)
    /////console.log(test)
    let data = new File([str], { type: "text/plain" });
  
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (icsFile !== null) {
      window.URL.revokeObjectURL(icsFile);
    }
    
    icsFile = window.URL.createObjectURL(data);
    
    return icsFile;
}
