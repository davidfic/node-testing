const express = require('express');

const logger = require('./middleware/logger');

const app = express();

// app.use(logger);

app.get('/', (req, res) => {
  res.json({ a: 1 });
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/members', require('./routes/api/members'));
app.use('/api/chores', require('./routes/api/chores'));
app.use('/api/wishlists', require('./routes/api/wishlists'));

// body parser middleware

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
