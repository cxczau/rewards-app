const express = require('express');

const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.Member.findAll({
    where: {
      ...req.query,
    },
  })
    .then((member) => {
      res.status(200).send(JSON.stringify(member));
    })
    .catch((err) => {
      res.status(400).send(JSON.stringify(err));
    });
});

router.get('/all', (req, res) => {
  db.Member.findAll()
    .then((members) => {
      res.status(200).send(JSON.stringify(members));
    })
    .catch((err) => {
      res.status(400).send(JSON.stringify(err));
    });
});

router.get('/:id', (req, res) => {
  db.Member.findByPk(req.params.id)
    .then((member) => {
      res.status(200).send(JSON.stringify(member));
    })
    .catch((err) => {
      res.status(400).send(JSON.stringify(err));
    });
});

router.put('/', (req, res) => {
  db.Member.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday,
    email: req.body.email,
  })
    .then((member) => {
      res.status(201).send(JSON.stringify(member));
    })
    .catch((err) => {
      res.status(400).send(JSON.stringify(err));
    });
});

router.post('/:id', async ({ params, body }, res) => {
  const found = await db.Member.findByPk(params.id);

  if (found) {
    // Only update the fields that were actually passed
    found.update({
      ...body.firstName && { firstName: body.firstName },
      ...body.lastName && { lastName: body.lastName },
      ...body.birthday && { birthday: body.birthday },
      ...body.email && { email: body.email },
    })
      .then((member) => {
        res.status(200).send(JSON.stringify(member));
      })
      .catch((err) => {
        res.status(400).send(JSON.stringify(err));
      });
  } else {
    res.status(400).send(JSON.stringify({ error: 'Member not found' }));
  }
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
      res.status(400).send(JSON.stringify(err));
    });
});

module.exports = router;
