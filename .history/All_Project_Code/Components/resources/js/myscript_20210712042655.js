
$("#tocomment").on('click',function(){
  console.log("click")
  $(".modal-body").html($(this).attr('data-content'));
  $("#myModal").modal('show');
});