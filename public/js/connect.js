$(function(){

  $(document).on('click', '#connect', function(e) {
    e.preventDefault();

    var user_id = $('#user_id').val();
    $.ajax({
      type: 'POST',
      url: "/follow/" + user_id,
      success: function(data) {
        $('#connect').removeClass('btn-default').addClass('btn-primary')
          .html('Connected').attr('id', 'unconnect')
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('click', '#unconnect', function(e) {
    e.preventDefault();

    var user_id = $('#user_id').val();
    $.ajax({
      type: 'POST',
      url: "/unfollow/" + user_id,
      success: function(data) {
        $('#unconnect').removeClass('btn-primary btn-danger').addClass('btn-default')
          .html('Connect').attr('id', 'connect')
      },
      error: function(data) {
        console.log(data);
      }
    });
  });

  $(document).on('mouseenter', '#unconnect', function(e) {
    $(this).removeClass('btn-primary').addClass('btn-danger').html('Unconnect');
  });

  $(document).on('mouseleave', '#unconnect', function(e) {
    $(this).removeClass('btn-danger').addClass('btn-primary').html('Connected');
  });







})
