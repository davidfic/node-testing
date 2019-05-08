const { Client } = require('pg');
const client = new Client();

client.connect();

const res = client.query('SELECT * from wishlist');
console.log(res);
client.end();
