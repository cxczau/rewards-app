const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { deleted, ...query } = req.query;
  // Gives ability to search for deleted Rewards
  const deletedQuery = deleted ? { deletedAt: { [Op.ne]: null } } : { deletedAt: null };

  db.Reward.findAll({
    where: {
      ...deletedQuery,
      ...query,
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
  db.Reward.findAll({
    where: {
      deletedAt: null,
    },
  })
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
  const found = await db.Reward.findOne({
    where: {
      id: params.id,
      deletedAt: null,
    },
  });

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
    res.status(500).send(JSON.stringify({ error: 'Reward not found' }));
  }
});

router.delete('/:id', (req, res) => {
  db.Reward.update({
    deletedAt: new Date(),
  }, {
    where: {
      id: req.params.id,
      deletedAt: null,
    },
  })
    .then(() => {
      res.status(200).send({ success: true });
    })
    .catch((err) => {
      res.status(500).send(JSON.stringify(err));
    });
});

module.exports = router;
