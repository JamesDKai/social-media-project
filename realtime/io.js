const async = require('async');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = function(io) {

  io.on('connection', function(socket) {
    console.log("Connected");
    var user = socket.request.user;
    console.log(user.name);


    socket.on('post', (data) => {
      console.log(data);
      async.parallel([
        function(callback) {
          io.emit('incomingPosts', { data, user });
        },

        function(callback) {
          async.waterfall([
            function(callback) {
              var post = new Post();
              post.content = data.content;
              post.owner = user._id;
              post.save(function(err) {
                callback(err, post);
              })

            },

            function(post, callback) {
              User.update(
                {
                  _id: user._id
                },
                {
                  $push: { posts: { post: post._id }},

                }, function(err, count) {
                  callback(err, count);// end of the code
                }
              );
            }
          ]);
        }
      ]);
    });
  });



}
