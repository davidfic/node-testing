const express = require('express');

const wishlists = require('../../Wishlists');
const passwrd = require('../../config');
const router = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient,
  format = require('util').format;
const assert = require('assert');

// Connection URL
const url = `mongodb://david:${password}@ds127536.mlab.com:27536/save-spend-share`;
// const url =
//   'mongodb://david:password99@ds127536.mlab.com:27536/save-spend-share';
// const url = 'mongodb://localhost:27017/wishlists';

// Database Name
const dbName = 'wishlists';

// Create a new MongoClient
const client = new MongoClient(url);
var db;
// Use connect method to connect to the Server
client.connect(function(err) {
  // assert.equal(null, err);
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connected successfully to server');
  db = client.db(dbName);
});

router.get('/', (req, res) => {
  const results = db
    .collection('wishlists')
    .find({})
    .toArray(function(err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// GET SINGLE wishlist

router.get('/:name', (req, res) => {
  const result = db
    .collection('wishlists')
    .findOne({ name: req.params.name }, function(err, result) {
      if (err) throw err;
      res.json(result);
    });

  // res.json(result);
});

router.post('/', (req, res) => {
  const newWishlist = {
    id: uuid.v4(),
    name: req.body.name,
    goal: req.body.goal,
    added: req.body.added
  };
  if (!newWishlist.name || !newWishlist.goal) {
    return res.status(400).json({ msg: 'please include name and goal' });
  }
  const collection = db.collection('wishlists');
  collection.insertOne(
    { name: req.body.name, goal: req.body.goal, added: req.body.added },
    (err, result) => {
      res.json(result);
    }
  );
});

router.put('/:name', (req, res) => {
  // const result = db
  //   .collection('wishlists')
  //   .findOne({ name: req.params.name }, function(err, result) {
  //     if (err) throw err;

  //     res.json(result);
  //   });

  const found = wishlists.some(wishlist => wishlist.name === req.params.name);
  console.log(req.body);
  if (req.body.goal) {
    console.log('goal is %s', req.body.goal);
  } else {
    console.log('goal not in req.body');
  }
  if (found) {
    const updateWishlist = req.body;

    wishlists.forEach(wishlist => {
      if (wishlist.name === parseInt(req.params.name)) {
        wishlist.name = updateWishlist.name
          ? updateWishlist.name
          : wishlist.name;
        wishlist.goal = updateWishlist.goal
          ? updateWishlist.goal
          : wishlist.goal;
        wishlist.added = updateWishlist.added
          ? updateWishlist.added
          : wishlist.added;
        res.json({ msg: 'wishlist updated', wishlist });
      }
    });
  } else {
    console.log('not found');
    res
      .status(400)
      .json({ msg: `No Wishlist with the id of ${req.params.name}` });
  }
});

//delete wishlist
router.delete('/:name', (req, res) => {
  // must load in wishlist from db first
  const found = wishlists.some(
    wishlist => wishlist.name === parseInt(req.params.name)
  );
  if (found) {
    res.json({
      msg: 'Wishlist deleted',
      wishlists: wishlists.filter(wishlist => wishlist.name !== req.params.name)
    });
  } else {
    res
      .status(400)
      .json({ msg: `No wishlist with the name of ${req.params.name}` });
  }
});
module.exports = router;
