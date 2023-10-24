const db = require('../database');

db.sequelize.sync();

// Seed database with test data
for (let i = 0; i < 5; i += 1) {
  db.Member.findOrCreate({
    where: {
      firstName: ['John', 'Jane', 'Jack', 'Jill', 'James'][i],
      lastName: ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown'][i],
      birthday: '1990-01-01',
      email: `user_${i}@email.com`,
    },
  });

  db.Reward.findOrCreate({
    where: {
      name: `Reward $${i * 10}`,
      description: `Reward Description ${i}`,
      cost: i * 10,
    },
  });

  db.MemberReward.findOrCreate({
    where: {
      memberId: i + 1,
      rewardId: i + 1,
    },
  });
}
