var exampleModal = document.getElementById('exampleModal')
$("#").on('click',function(){
  $(".modal-body").html($(this).attr('data-content'));
});