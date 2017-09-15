const users = require('./users.js')
const { createError } = require('micro')

exports.getUser = async (id) => {
  let allUsers = await users
  if(id  >= 0 && id < allUsers.length) {
    let user = allUsers[id]
    return user
  }
  throw createError(404, 'User not found')
}

exports.getUsers = async () => {
  return await users
}
