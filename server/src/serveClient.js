'use strict';

const fs = require('fs');
const path = require('path');

const indexHTML = fs.readFileSync(
  path.resolve(
    __dirname,
    path.join('public', 'index.html')
  )
);

module.exports = function serveClient(req, res, next) {
  res.end(indexHTML);
};
