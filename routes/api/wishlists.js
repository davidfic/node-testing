const express = require('express');
const wishlists = require('../../Wishlists');
const router = express.Router();
const uuid = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://david:password99@ds127536.mlab.com:27536/save-spend-share';

// Database Name
const dbName = 'save-spend-share';
// Create a new MongoClient
const client = new MongoClient(url);
var db;
// Use connect method to connect to the Server
client.connect(function(err) {
  // assert.equal(null, err);
  if(err) {
    console.error(err)
    return
  }
  console.log("Connected successfully to server");

  
  db = client.db(dbName);  
//  console.log(db);
  // client.close();
});




router.get('/', (req, res) => {
  
  db.collection("wishlists").find({}).toArray(function(err, result) {
    if (err) throw err;
    res.json(result)
    
  });
  // res.json(wishlists);
});

// GET SINGLE wishlist
router.get('/:id', (req, res) => {
  db.collection("wishlists").findOne({_id: req.params.id}, function(err, result) {
    if (err) throw err;
    
    console.log('id passed in is %s', req.params.id)
    res.json(result)
    // db.close();
  });

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
  const collection = db.collection('wishlists')
  collection.insertOne({name: req.body.name, goal: req.body.goal, added: req.body.added}, (err, result) => {
    console.log(err, result);
    res.json(result)
  })

  // wishlists.push(newWishlist);

  // res.json(wishlists);
});

router.put('/:name', (req, res) => {
  const found = wishlists.some(
    wishlist => wishlist.name === parseInt(req.params.name)
  );
  if (found) {
    const updateWishlist = req.body;
    wishlists.forEach(wishlist => {
      if (wishlist.name === parseInt(req.params.name)) {
        wishlist.name = updateWishlist.name
          ? updateWishlist.name
          : wishlist.name;
        wishlist.email = updateWishlist.email
          ? updateWishlist.email
          : wishlist.email;
        res.json({ msg: 'wishlist updated', wishlist });
      }
    });
  } else {
    res
      .status(400)
      .json({ msg: `No Wishlist with the id of ${req.params.id}` });
  }
});

//delete wishlist
router.delete('/:id', (req, res) => {
  const found = wishlists.some(
    wishlist => wishlist.id === parseInt(req.params.id)
  );
  if (found) {
    res.json({
      msg: 'Wishlist deleted',
      wishlists: wishlists.filter(
        wishlist => wishlist.id !== parseInt(req.params.id)
      )
    });
  } else {
    res
      .status(400)
      .json({ msg: `No wishlist with the id of ${req.params.id}` });
  }
});
module.exports = router;
