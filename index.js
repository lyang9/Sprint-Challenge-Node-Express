// node dependencies
const express = require('express');
const server = express();
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');

// database helpers
const projectDb = require('./data/helpers/projectModel');
const actionDb = require('./data/helpers/actionModel');

// middleware
server.use(express.json());
server.use(cors(), logger(), helmet());

// port listening
const port = 5000;
server.listen(port, () => 
  console.log(`\n=== API running on port ${port} ===\n`)
);