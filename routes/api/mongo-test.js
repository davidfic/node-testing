const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/wishlists';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log('Database connected!');
  //   const dbo = db.db('wishlists');

  var dbo = db.db('wishlists');
  //   dbo
  //     .collection('wishlists')
  //     .insertOne({ name: 'ps4', goal: 400, added: 20 }, function(err, res) {
  //       if (err) throw err;
  //       console.log('1 document inserted');
  //       db.close();
  //     });

  const results = dbo.collection('wishlists').find({});
  results.forEach(row => {
    console.log('hello');
    console.log(row);
  });
});
