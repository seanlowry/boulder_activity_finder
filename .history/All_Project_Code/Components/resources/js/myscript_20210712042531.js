var exampleModal = document.getElementById('exampleModal')
$("#tocomment").on('click',function(){
  $(".modal-body").html($(this).attr('data-content'));
  $$("#myModal").modal('show');
});