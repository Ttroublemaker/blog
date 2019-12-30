const querystring = require("querystring")

const {
    get,
    set
} = require('./src/db/redis')

const {
    access
} = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 获取cookie过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000)
    return d.toGMTString() //字符串时间格式"Fri, 20 Dec 2019 16:53:49 GMT"
}

// session数据
// let SESSION_DATA = {}

// 用户处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(
                JSON.parse(postData)
            )
        })
    })
    return promise
}

const serverHandle = (req, res) => {
    // 记录访问日志
    access(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)
    // 设置返回格式 JSON
    res.setHeader('Content-type', 'application/json')
    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split("?")[1])


    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(";").forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split("=")
        const key = arr[0].trim()
        const val = arr[1].trim()
        console.log(key, val)
        req.cookie[key] = val
    });

    // 解析session
    // let needSetCookie = false
    // let userId = req.cookie.userid
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]
    // console.log(' req.session', req.session)
    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }
    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        // 处理 post data
        return getPostData(req)
    }).then(postData => {
        console.log('postData', postData)
        req.body = postData
        // 处理blog路由
        const blogResult = handleBlogRouter(req, res)
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    //httpOnly只允许后端修改cookie,客户端不允许更改,账户安全,expires为cookie过期时间
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        // 处理user路由
        const userResult = handleUserRouter(req, res)
        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    //httpOnly只允许后端修改cookie,客户端不允许更改,账户安全,expires为cookie过期时间
                    res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }
        // 未命中路由，返回404
        res.writeHead(404, {
            'Content-type': 'text/plain'
        })
        res.write('404 Not Found\n')
        res.end()
    })


}
module.exports = serverHandle