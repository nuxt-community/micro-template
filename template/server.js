const Nuxt = require('nuxt')
const {send} = require('micro')
const micro = require('micro')
const url = require('url')
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || '3000'

const {getUser, getUsers} = require('./api/')

// Import and Set Nuxt.js options
let config = require('./nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  nuxt.build()
  .catch((error) => {
    console.error(error) // eslint-disable-line no-console
    process.exit(1)
  })
}
const serviceConfig = async function(req, res) {
  let urlPath = url.parse(req.url).path
  console.log(urlPath)
  let split = urlPath.split('/')
  // console.log(split)
  let possibleId = parseInt(urlPath.split('/')[urlPath.split('/').length -1], 10)
  console.log(possibleId)
  if(urlPath.indexOf('/api/users') == 0 && isNaN(possibleId)) {
    send(res, 200, await getUsers())
  } else if (urlPath.indexOf('/api/users') == 0 && Number.isInteger(possibleId)) {
    let user = await getUser(possibleId)
    send(res, 200, user)
  } else {
    await nuxt.render(req, res)
  }
}
const server = micro(serviceConfig)

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
