const env = process.env.NODE_ENV || 'development'

const config = {
  production: {
    port: 8888,
    dbURL: 'mongodb://mongo/blog-koa',
    redis: {
      session: {
        host: 'redis',
        port: 6379,
        db: 1,
      },
      server: {
        host: 'redis',
        port: 6379,
        db: 2,
      }
    }
  },
  development: {
    port: 3000,
    dbURL: 'mongodb://localhost/blog-koa',
    redis: {
      session: {
        host: '127.0.0.1',
        port: 6379,
        db: 1,
      },
      server: {
        host: '127.0.0.1',
        port: 6379,
        db: 2,
      }
    }
  }
}

module.exports = config[env]
