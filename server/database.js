const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_SCHEMA || 'postgres',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true',
    },
  },
);

const Member = sequelize.define('Member', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  birthday: {
    type: Sequelize.DATEONLY,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
});

const Reward = sequelize.define('Reward', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: Sequelize.TEXT,
  },
  cost: {
    type: Sequelize.INTEGER,
    min: 0,
  },
});

const MemberReward = sequelize.define('MemberReward', {
  memberId: {
    type: Sequelize.INTEGER,
    references: {
      model: Member,
      key: 'id',
    },
  },
  rewardId: {
    type: Sequelize.INTEGER,
    references: {
      model: Reward,
      key: 'id',
    },
  },
});

module.exports = {
  sequelize,
  Member,
  Reward,
  MemberReward,
};
