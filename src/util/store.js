import Redis from 'ioredis';
import { Store } from 'koa-session2';

const maxAge = 24 * 3600

export default class RedisStore extends Store {
  constructor() {
    super()
    this.redis = new Redis({
      host: process.env.REDIS_SESSION_HOST,
      port: process.env.REDIS_SESSION_POST,
      db: process.env.REDIS_SESSION_DB,
      password: process.env.REDIS_AUTH
    })
  }

  async get(sid) {
    let data = await this.redis.get(`SESSION:${sid}`)
    return JSON.parse(data)
  }

  async set(session, opts) {
    if(!opts.sid) {
        opts.sid = this.getID(24)
    }
    await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session), 'ex', maxAge)
    return opts.sid
  }

  async destroy(sid) {
    return await this.redis.del(`SESSION:${sid}`)
  }
}
