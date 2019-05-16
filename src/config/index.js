const env = process.env.NODE_ENV || 'development'

const config = {
  production: {
    port: 8888,
    dbURL: 'mongodb://mongo/blog-koa',
    redisHost: 'redis'
  },
  development: {
    port: 3000,
    dbURL: 'mongodb://localhost/blog-koa',
    redisHost: '127.0.0.1'
  }
}
  
module.exports = config[env]