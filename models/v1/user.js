const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      comment: "User Id(PK)"
    },
    username: {
      allowNull: true,
      type: DataTypes.STRING(60),
      defaultValue: "",
      comment: "User name"
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: "",
      comment: "User encoded password"
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "JWT Token"
    },
    is_status: {
      allowNull: false,
      type: DataTypes.ENUM("active", "inactive", "deleted", "deactivated"),
      defaultValue: "active",
      comment: "Status"
    },
  },
    {

      instanceMethods: {
        validPassword: (password) => {
          return bcrypt.compareSync(password, this.password);
        },
      },
    },
    {
      indexes: [
        {
          fields: ["name"],
          name: "Idx_name",
        }
      ]
    }

  );
  User.prototype.encryptPassword = async (password) => {
    const salt = bcrypt.genSaltSync(10, "a");
    return bcrypt.hashSync(password, salt);
  };
  User.prototype.validPassword = async (password, hash) => {
    return bcrypt.compareSync(password, hash);
  };
  User.prototype.generateJWT = function () {
    return jwt.sign(
      {
        id: this.dataValues.user_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXP,
      }
    );
  };

  return User;
};