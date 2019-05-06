const express = require('express');
const chores = require('../../Chores');
const router = express.Router();

router.get('/', (req, res) => {
  res.json(chores);
});

// GET SINGLE member
router.get('/:id', (req, res) => {
  const found = chores.some(chore => chore.id === parseInt(req.params.id));
  if (found) {
    res.json(chores.filter(chore => chore.id === parseInt(req.params.id)));
  } else {
    res.status(400).json({ msg: `No Chore with the id of ${req.params.id}` });
  }
});

module.exports = router;
