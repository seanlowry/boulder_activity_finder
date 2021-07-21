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

function format_timestamp(timestamp) {
  var date_arr = timestamp.toString().split(" ")
  var ret = {};
  ret["full"] = date_arr;
  ret["weekday"] = date_arr[0];
  ret["month"] = date_arr[1];
  ret["day"] = date_arr[2];
  ret["year"] = date_arr[3];
  ret["date"] = `${date_arr[1]} ${date_arr[2]}, ${date_arr[3]}`;
  var time = date_arr[4].split(":");
  var hour = time[0]
  let ampm = (Number(hour) < 12) ? "a.m." :  "p.m.";
  hour = Number(hour)%12;
  time = `${hour.toString()}:${time[1]} ${ampm}`;
  ret["time"] = time;
  return ret;
}

function validateForm() {
  if (!checkUsernameAvail()) {
    alert("The username that you selected is already in use");
    return false;
  }
  if (!checkPasswordMatch()) {
    alert("The passwords that you entered do not match");
    return false;
  }
  return true;
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


function start_download(param){
  console.log("function called")
  console.log(param)
  //console.log(title)
 // console.log(desc)
  //console.log(time)
  //create <a> for event.ics to download
  let a = document.createElement('a')
  a.download = "event.ics"
  a.style.display = 'none'
    let url = createICSfile(param);
    a.href = url
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url) // delete file
    document.body.removeChild(a)
}

var icsFile = null;


function retMonth(month){
  if(month == "Jan"){
    return "01"
  }if(month == "Feb"){
    return "02"
  }if(month == "Mar"){
    return "03"
  }if(month == "Apr"){
    return "04"
  }if(month == "May"){
    return "05"
  }if(month == "Jun"){
    return "06"
  }if(month == "Jul"){
    return "07"
  }if(month == "Aug"){
    return "08"
  }if(month == "SEP" || month == "SEPT"){
    return "09"
  }if(month == "OCT"){
    return "10"
  }if(month == "NOV"){
    return "11"
  }if(month == "DEC"){
    return "12"
  }
}

/*
  calendar can automatically switch to Boulder time for users in different regions with TZID being set
  remind users events before 10 mins
*/
function createICSfile(id){
    var ele = document.getElementById(id)
    console.log(ele.getAttribute('data-content'))
    var params = ele.getAttribute('data-content').split("&")
    var temp_date = params[2].split(' ')
    console.log("date:"+temp_date)
    var temp_time = temp_date[4].split(':')
    console.log("time:"+temp_time)
    var event_str = "BEGIN:VCALENDAR\n" +
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
    "END:VTIMEZONE\n"+
    "BEGIN:VEVENT\n" +
     "UID:" +
         Math.random().toString(36).substring(2) +
     "\n" +
     "DTSTART;" + "TZID=America/Denver:" +
     temp_date[2] + retMonth(temp_date[0]) + temp_date[1] + "T" + temp_time[0] + temp_time[1] + temp_time[2] +
     "\n" +
     "DTEND;" + "TZID=America/Denver:" +
     temp_date[2] + retMonth(temp_date[0]) + temp_date[1] + "T" + "235959" +
     "\n" +
     "TZID:America/Denver\n" +
     "SUMMARY:" +
      params[0] +
     "\n" +
     "DESCRIPTION:" + params[1] +
     "\n" +
     "BEGIN:VALARM\n" +
     "TRIGGER:-PT10M\n" +
     "ACTION:DISPLAY\n" +
    "DESCRIPTION:Reminder\n" +
    "END:VALARM\n" +
     "END:VEVENT\n" +
    "END:VCALENDAR";
    console.log(event_str)

    let data = new Blob([event_str], { type: "text/plain" });
    if (icsFile !== null) {
      window.URL.revokeObjectURL(icsFile);
    }
    icsFile = window.URL.createObjectURL(data);
    return  icsFile;
}
