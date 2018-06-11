const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const Post = require('../models/post');

router.get('/', (req, res, next) => {
  if (req.user) {

    Post.find({})
      .sort('-created')
      .populate('owner')
      .exec(function(err, posts) {
        if (err) return next(err);
        console.log(posts);
        res.render('main/home', { posts: posts });
      });
  } else {
    res.render('main/landing');
  }


});

router.get('/user/:id', (req, res, next) => {
  async.waterfall([
    function(callback) {
      Post.find({ owner: req.params.id })
        .populate('owner')
        .exec(function(err,posts) {
          callback(err, posts);
        });
    },

    function(posts, callback) {
      User.findOne({ _id: req.params.id })
        .populate('following')
        .populate('followers')
        .exec(function(err, user) {
          var follower = user.followers.some(function(friend) {
            return friend.equals(req.user._id);
          });

          var currentUser;
          if (req.user._id.equals(user._id)) {
            currentUser = true;
          } else {
            currentUser = false;
          }
          res.render('main/user', { foundUser: user, posts: posts, currentUser: currentUser, follower: follower });
        });
    }
  ]);
});


router.post('/follow/:id', (req, res, next) => {
  async.parallel([
    function(callback) {
      User.update(
        {
          _id: req.user._id,
          following: { $ne: req.params.id }
        },
        {
          $push: { following: req.params.id }
        }, function(err, count) {
          callback(err, count);
        }
      )
    },

    function(callback) {
      User.update(
        {
          _id: req.params.id,
          followers: { $ne: req.user._id }
        },
        {
          $push: { followers: req.user._id }
        }, function(err, count) {
          callback(err, count);
        }
      )
    }
  ], function(err, results) {
    if (err) return next(err);
    res.json("Success");
  });
});



router.post('/unfollow/:id', (req, res, next) => {
  async.parallel([
    function(callback) {
      User.update(
        {
          _id: req.user._id,
        },
        {
          $pull: { following: req.params.id }
        }, function(err, count) {
          callback(err, count);
        }
      )
    },

    function(callback) {
      User.update(
        {
          _id: req.params.id,
        },
        {
          $pull: { followers: req.user._id }
        }, function(err, count) {
          callback(err, count);
        }
      )
    }
  ], function(err, results) {
    if (err) return next(err);
    res.json("Success");
  });
});




module.exports = router;
