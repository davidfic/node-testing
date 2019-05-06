const express = require('express');
const wishlists = require('../../Wishlists');
const router = express.Router();
const uuid = require('uuid');

router.get('/', (req, res) => {
  res.json(wishlists);
});

// GET SINGLE wishlist
router.get('/:id', (req, res) => {
  const found = wishlists.some(
    wishlist => wishlist.id === parseInt(req.params.id)
  );
  if (found) {
    res.json(
      wishlists.filter(wishlist => wishlist.id === parseInt(req.params.id))
    );
  } else {
    res
      .status(400)
      .json({ msg: `No wishlist with the id of ${req.params.id}` });
  }
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

  wishlists.push(newWishlist);

  res.json(wishlists);
});

router.put('/:id', (req, res) => {
  const found = wishlists.some(
    wishlist => wishlist.id === parseInt(req.params.id)
  );
  if (found) {
    const updateWishlist = req.body;
    wishlists.forEach(wishlist => {
      if (wishlist.id === parseInt(req.params.id)) {
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
