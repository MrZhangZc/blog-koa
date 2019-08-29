import Redis from 'ioredis'
import { redis } from '../config'

const redisClirnt = new Redis(redis.server)

export default redisClirnt
