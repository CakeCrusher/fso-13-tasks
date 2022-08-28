const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class UserBlogs extends Model {}

UserBlogs.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "users", key: "id" },
      allowNull: false,
    },
    blogId: {
      type: DataTypes.INTEGER,
      references: { model: "blogs", key: "id" },
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "user_blogs",
    underscored: true,
    timestamps: false,
  }
);

module.exports = UserBlogs;
