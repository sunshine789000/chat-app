const config = require("../../config/config.js");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    logging: 0,
    operatorsAliases: 0,
    define: {
      freezeTableName: 1,
    },
    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.user = require("./user.js")(sequelize, DataTypes);
db.messages = require("./messages.js")(sequelize, DataTypes);

db.messages.belongsTo(db.user, { foreignKey: "receiver_id" });
db.user.hasMany(db.messages, { foreignKey: "receiver_id" });
db.messages.belongsTo(db.user, { foreignKey: "sender_id" });
db.user.hasMany(db.messages, { foreignKey: "sender_id" });

module.exports = db;