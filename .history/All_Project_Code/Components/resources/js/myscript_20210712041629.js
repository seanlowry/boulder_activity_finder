var exampleModal = document.getElementById('exampleModal')
$("#exampleModal").on('click',function(){
  $(".modal-body").html($(this).attr('data-content'));
});