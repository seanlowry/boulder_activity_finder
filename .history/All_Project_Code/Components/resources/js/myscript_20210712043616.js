
$(".btnmodal").on('click',function(){
  console.log($(this).attr('data-content'))

  $(".modal-body").html($(this).attr('data-content'));
  $("#myModal").modal('show');
});