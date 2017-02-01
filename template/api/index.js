const users = require('./users.js')

exports.getUser = async (id) => {
  let allUsers = await users
  if(id  >= 0 && id < allUsers.length) {
    let user = allUsers[id]
    return user
  }
  return null
}

exports.getUsers = async () => {
  return await users
}
