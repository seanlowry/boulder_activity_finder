
$(".btnmodal").on('click',function(){
  //console.log($(this).attr('data-content'))
  let data_content = $(this).attr('data-content').toString()
  modal_arr = data_content.split('&')
  console.log(modal_arr)
  console.log(data_content)
  let temp_title
  let temp_full_desc = $(this).attr('')
  $(".modal-title").html(modal_arr[0]);
  $(".modal-body").prepend(modal_arr[modal_arr.length - 1]);
  $("#myModal").modal('show');
});