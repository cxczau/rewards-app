const express = require('express');

const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  db.Reward.findAll({
    where: {
      ...req.query,
    },
  })
    .then((reward) => {
      res.status(200).send(JSON.stringify(reward));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.get('/all', (req, res) => {
  db.Reward.findAll()
    .then((rewards) => {
      res.status(200).send(JSON.stringify(rewards));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.get('/:id', (req, res) => {
  db.Reward.findByPk(req.params.id)
    .then((reward) => {
      res.status(200).send(JSON.stringify(reward));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.put('/', (req, res) => {
  db.Reward.create({
    name: req.body.name,
    description: req.body.description,
    cost: req.body.cost,
  })
    .then((reward) => {
      res.status(201).send(JSON.stringify(reward));
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

router.post('/:id', async ({ params, body }, res) => {
  const found = await db.Reward.findByPk(params.id);

  if (found) {
    found.update({
      ...body.name && { name: body.name },
      ...body.description && { description: body.description },
      ...body.cost && { cost: body.cost },
    })
      .then((reward) => {
        res.status(200).send(JSON.stringify(reward));
      })
      .catch((err) => {
        res.status(500).send(JSON.stringify(err));
      });
  } else {
    res.status(500).send(JSON.stringify({ error: 'Member not found' }));
  }
});

router.delete('/:id', (req, res) => {
  db.Reward.destroy({
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
