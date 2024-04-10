module.exports = (sequelize, DataTypes) => {
    const messages = sequelize.define('messages', {
      message_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        comment: "Message Id(PK)"
      },
      receiver_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'user',
          key: 'user_id', 
        },
        comment: "Receiver Id(FK)"
      },
      sender_id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: true,
        references: {
          model: 'user',
          key: 'user_id', 
        },
        comment: "Sender Id(FK)"
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Message"
      },
      is_status: {
        allowNull: false,
        type: DataTypes.ENUM("active", "inactive", "deleted"),
        defaultValue: "active",
        comment: "Status"
      },
    }
    );
  
    return messages;
  };