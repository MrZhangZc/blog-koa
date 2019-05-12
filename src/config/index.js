const env = process.env.NODE_ENV || 'development'

const config = {
  production: {
    port: 8888,
    dbURL: 'mongodb://mongo/blog-koa'
  },
  development: {
    port: 3000,
    dbURL: 'mongodb://localhost/blog-koa'
  }
}
  
module.exports = config[env]