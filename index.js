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

server.post('/api/projects', (req, res) => {
  const { name, description, completed } = req.body;
  const newProject = { name, description, completed };
  projectDb
    .insert(newProject)
    .then(projectId => {
      const { id } = projectId;
      projectDb.get(id)
        .then(newProject => {
          if (!newProject) {
            res.status(400).json({ errorMessage: "Please provide name, description, and completed for the project." });
          }
          res.status(201).json(project);
        })
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the project to the database", err });
    })
});

server.delete('/api/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  if (!projectId) {
    res.status(404).json({ message: "The project with the specified ID does not exist." });
  }
  projectDb.remove(projectId)
    .then(removedProject => {
      res.status(200).json({ message: "The project was deleted" });
    })
    .catch(err => {
      res.status(500).json({ error: "The project could not be removed", err });
    })
});

server.put('/api/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  const { name, description, completed } = req.body;
  const newProject = { name, description, completed };
  if (!projectId) {
    res.status(404).json({ message: "The project with the specified ID does not exist." });
  }
  else if (!newProject) {
    res.status(400).json({ errorMessage: "Please provide name, description, and completed for the project." });
  }
  projectDb.update(projectId, newProject)
    .then(project => {
      res.status(200).json({ message: "The project has updated" });
    })
    .catch(err => {
      res.status(500).json({ error: "The project information could not be modified.", err });
    })
});

server.get('api/projects/:projectId/actions', (req, res) => {
  const projectId = req.params.projectId;
  projectDb
    .getProjectActions(projectId)
    .then(actions => {
      if (!actions) {
        res.status(400).json({ message: "The action for project with the specified ID does not exist." });
      }
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The action for project information could not be retrieved.", err });
    })
});


// action database endpoints
server.get('/api/actions', (req, res) => {
  actionDb.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(err => {
      res.status(500).json({ error: "The actions information could not be retrieved.", err });
    })
});

// port listening
const port = 5000;
server.listen(port, () => 
  console.log(`\n=== API running on port ${port} ===\n`)
);