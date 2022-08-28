const { sequelize } = require("../util/db");
const { Model, DataTypes } = require("sequelize");

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    yearWritten: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1991,
        dynamicMax(value) {
          if (value > new Date().getFullYear()) {
            throw new Error("Year must be less than or equal to current year");
          }
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

module.exports = Blog;
