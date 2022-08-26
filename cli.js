#!/usr/bin/env node

import inquirer from 'inquirer'
import {Sequelize, Model, DataTypes, QueryTypes} from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize(
  process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
)

class Blog extends Model {}
Blog.init({
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
  }
}, {
  sequelize,
  underscored: true,
  timestamped: false,
  modelName: 'blog'
})

const makeQuery = async () => {
  const query = await inquirer.prompt({
    name: 'query',
    type: 'input',
    message: 'Enter a search query:',
    default: 'SELECT * FROM blogs;'
  })
  try {
    const res = await sequelize.query(query)
    res[0].forEach(blog => {
      console.log(`${blog.author}: ${blog.title}, ${blog.likes} likes`)
    })
  } catch (error) {
    console.log(error)
  }
}

makeQuery()