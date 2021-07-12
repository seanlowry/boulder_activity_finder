
$(".btnmodal").on('click',function(){
  //console.log($(this).attr('data-content'))
  let data_content = $(this).attr('data-content').toString()
  modal_arr = data_content.split('&')
  console.log(modal_arr)
  console.log(data_content)
  let temp_title
  let temp_full_desc = $(this).attr('')
  var str = $('.modal-title').html()
  if(!str.includes(modal_arr[0])){
    $(".modal-title").html(modal_arr[0]);
    console.log(modal_arr)
  
    if(modal_arr.length == 2){
      $(".modal-body").prepend("<h5>" + modal_arr[1]+"</h5>");
      console.log("222")
    }else{
    console.log("333")
    $(".modal-body").prepend("<h5>" + modal_arr[2]+"</h5>");
    $(".modal-body").prepend("<h4>" + modal_arr[1]+"</h4><br>");
  }
  }
    
  
  $("#myModal").modal('show');
  
});