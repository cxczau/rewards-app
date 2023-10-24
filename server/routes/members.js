const express = require('express');
const { Op } = require('sequelize');

const router = express.Router();
const db = require('../database');

const VIEWABLE_ATTRIBUTES = ['firstName', 'lastName', 'birthday', 'email', 'id', 'deletedAt'];

router.get('/', (req, res) => {
  const { deleted, view = VIEWABLE_ATTRIBUTES, ...query } = req.query;
  // Gives ability to search for deleted Members
  const deletedQuery = deleted ? { deletedAt: { [Op.ne]: null } } : { deletedAt: null };

  // Only return the attributes that were requested
  const attributes = VIEWABLE_ATTRIBUTES.filter((attribute) => view.includes(attribute));
  const include = view.includes('rewards') ? [{
    model: db.MemberReward,
    required: false,
    where: {
      deletedAt: null,
    },
    include: [{
      model: db.Reward,
      required: false,
      where: {
        deletedAt: null,
      },
    }],
  }] : [];

  db.Member.findAll({
    where: {
      ...deletedQuery,
      ...query,
    },
    attributes,
    include,
  })
    .then((member) => {
      res.status(200).send(JSON.stringify(member));
    })
    .catch((err) => {
      res.status(400).send(JSON.stringify(err));
    });
});

router.get('/all', (req, res) => {
  db.Member.findAll({
    include: [{
      model: db.MemberReward,
      required: false,
      where: {
        deletedAt: null,
      },
      include: [{
        model: db.Reward,
        required: false,
        where: {
          deletedAt: null,
        },
      }],
    }],
  })
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
      ...body.undelete && { deletedAt: null },
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

router.get('/:id/rewards', async ({ params }, res) => {
  const foundMember = await db.Member.findOne({
    where: {
      id: params.id,
      deletedAt: null,
    },
  });

  if (foundMember) {
    db.MemberReward.findAll({
      where: {
        memberId: foundMember.id,
        deletedAt: null,
      },
      include: [{
        model: db.Reward,
        where: {
          deletedAt: null,
        },
      }],
    })
      .then((rewards) => {
        res.status(200).send(JSON.stringify(rewards));
      })
      .catch((err) => {
        res.status(400).send(JSON.stringify(err));
      });
  }
});

router.post('/:id/rewards/:rewardId', async ({ params }, res) => {
  const foundMember = await db.Member.findOne({
    where: {
      id: params.id,
      deletedAt: null,
    },
  });
  const foundReward = await db.Reward.findOne({
    where: {
      id: params.rewardId,
      deletedAt: null,
    },
  });

  if (foundMember && foundReward) {
    db.MemberReward.findOrCreate({
      where: {
        memberId: foundMember.id,
        rewardId: foundReward.id,
        deletedAt: null,
      },
    })
      .then((member) => {
        res.status(200).send(JSON.stringify(member));
      })
      .catch((err) => {
        res.status(400).send(JSON.stringify(err));
      });
  } else {
    res.status(400).send(JSON.stringify({ error: 'Member or Reward not found' }));
  }
});

router.delete('/:id', (req, res) => {
  db.Member.update({
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
      res.status(400).send(JSON.stringify(err));
    });
});

router.post('/:id/rewards/:rewardId/delete', async ({ params }, res) => {
  const foundMember = await db.Member.findOne({
    where: {
      id: params.id,
      deletedAt: null,
    },
  });
  const foundReward = await db.Reward.findOne({
    where: {
      id: params.rewardId,
      deletedAt: null,
    },
  });

  if (foundMember && foundReward) {
    db.MemberReward.update({
      deletedAt: new Date(),
    }, {
      where: {
        memberId: foundMember.id,
        rewardId: foundReward.id,
      },
    })
      .then((member) => {
        res.status(200).send(JSON.stringify(member));
      })
      .catch((err) => {
        res.status(400).send(JSON.stringify(err));
      });
  } else {
    res.status(400).send(JSON.stringify({ error: 'Member or Reward not found' }));
  }
});

module.exports = router;
