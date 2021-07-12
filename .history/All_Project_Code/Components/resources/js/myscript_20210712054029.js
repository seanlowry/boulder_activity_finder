
$(".btnmodal").on('click',function(){
  //console.log($(this).attr('data-content'))
  let data_content = $(this).attr('data-content').toString()
  modal_arr = data_content.split('&')
  console.log(modal_arr)
  console.log(data_content)
  let temp_title
  let temp_full_desc = $(this).attr('')
  $(".modal-title").html(modal_arr[0]);
  if(modal_arr.length == 2){
    $(".modal-body").prepend("<h5>" + modal_arr[2]+"</h5>");
  }else{
    $(".modal-body").prepend("<h4>" + modal_arr[2]+"</h4><br>");
    $(".modal-body").prepend("<h5>" + modal_arr[3]+"</h5>");
  }
  
  $("#myModal").modal('show');
});