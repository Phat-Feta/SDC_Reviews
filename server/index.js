const express = require('express');
const app = express();
const router = require('./routes.js')
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', router);

app.listen(PORT);
console.log('Listening on port ' + PORT);
