const express = require('express');

const router = express.Router();
const db = require('../database');

router.get('/all', (req, res) => {
  db.Member.findAll()
    .then((members) => {
      res.status(200).send(JSON.stringify(members));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.get('/:id', (req, res) => {
  db.Member.findByPk(req.params.id)
    .then((member) => {
      res.status(200).send(JSON.stringify(member));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.put('/', (req, res) => {
  db.Member.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    id: req.body.id,
  })
    .then((member) => {
      res.status(200).send(JSON.stringify(member));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.delete('/:id', (req, res) => {
  db.Member.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

module.exports = router;
