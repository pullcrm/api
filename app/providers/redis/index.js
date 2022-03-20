/**
 * Module dependencies.
 */
import {promisify} from 'util'
import redis from 'redis'

// const redis =
//   Boolean(config.get('isRedisMockEnabled')) === true
//     ? require('redis-mock')
//     : require('redis')

// Initialize connect
const client = redis.createClient({
  url: 'redis://redis:UR0t557tpU@127.0.0.1:6379/2',
})

/**
 * Example of usage
 * const redis = require('../lib/redis').client;
 * await redis.hdel('transactions', params.transactionId);
 */
client.hset = promisify(client.hset).bind(client)
client.hgetall = promisify(client.hgetall).bind(client)
client.hdel = promisify(client.hdel).bind(client)
client.hmset = promisify(client.hmset).bind(client)
client.expire = promisify(client.expire).bind(client)

// Check connections
client.on('connect', () => {
  console.log('Redis connected')
})

client.on('error', err => {
  console.log('Redis wasn\'t connected', err)
  process.exit(-1)
})

// Connection
export {client}
