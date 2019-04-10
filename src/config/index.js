const env = process.env.NODE_ENV || 'development'

const config = {
  production: {
    dbURL: 'mongodb://mongo/blog-koa'
  },
  development: {
    dbURL: 'mongodb://localhost/blog-koa'
  }
}
  
module.exports = config[env]