const Nuxt = require('nuxt')
const micro = require('micro')
const {send} = require('micro')
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || '3000'

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
  // at least serves static 404
  //send(res, 200, `talkin' Δ micro heavy`)
  await nuxt.render(req, res)
}
const server = micro(serviceConfig)

// Listen the server
server.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
