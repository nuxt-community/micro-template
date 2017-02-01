const Nuxt = require('nuxt')
const {send} = require('micro')
const micro = require('micro')
const url = require('url')
const dispatch = require('micro-route/dispatch')

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

// setup the microservice includinng intercepted routing
const serviceConfig = async function(req, res) {
  await dispatch()
    .dispatch('/api/users/:id', ['GET'], async (req, res, {params, query}) => send(res, 200, await getUser(params.id)))
    .dispatch('/api/users', ['GET'], async(req, res) => send(res, 200, await getUsers()))
    .dispatch('*', ['GET'], async (req, res) => await nuxt.render(req, res))
    (req, res)
}
const server = micro(serviceConfig)

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
