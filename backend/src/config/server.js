const express = require('express');

const app = express();
app.use(express.json());

app.set('puerto', 4044);

module.exports = app;

