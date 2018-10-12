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

// project database endpoints
server.get('/api/projects', (req, res) => {
  projectDb.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res.status(500).json({ error: "The projects information could not be retrieved.", err });
    })
});

server.get('/api/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  projectDb.get(projectId)
    .then(project => {
      if (!project) {
        res.status(404).json({ message: "The project with the specified ID does not exist." });
      }
      res.status(200).json(project);
    })
    .catch(err => {
      res.status(500).json({ error: "The project information could not be retrieved.", err });
    })
});

// port listening
const port = 5000;
server.listen(port, () => 
  console.log(`\n=== API running on port ${port} ===\n`)
);