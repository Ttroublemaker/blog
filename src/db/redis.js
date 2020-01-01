const redis = require('redis')

const {
    REDIS_CONFIG
} = require('../config/index')

// 创建客户端
const redisClient = redis.createClient(REDIS_CONFIG && REDIS_CONFIG.port, REDIS_CONFIG && REDIS_CONFIG.host)
redisClient.on('error', err => {
    console.error(err)
})

function set(key, val) {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)
}

function get(key) {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            // 未找到
            if (val == null) {
                resolve(null)
                return
            }
            try {
                // JSON格式
                resolve(JSON.parse(val))
            } catch (error) {
                // 非JSON格式
                resolve(val)
            }
            // 需要多次连接，所以这里不要退出
            // redisClient.quit()
        })
    })
    return promise
}
module.exports = {
    set,
    get
}