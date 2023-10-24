const db = require('../database');

db.sequelize.sync({ force: true });
