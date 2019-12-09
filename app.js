const querystring = require("querystring")

// import handleBlogRouter from './src/router/blog'
// import handleUserRouter from './src/router/user'
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 用户处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            retunrn
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
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const url = req.url
    req.path = url.split('?')[0]

    // 解析query
    req.query = querystring.parse(url.split("?")[1])

    // 处理postData
    getPostData(req).then(postData => {
        req.body = postData
        // 处理blog路由
        const blogData = handleBlogRouter(req, res)
        if (blogData) {
            res.end(JSON.stringify(blogData))
            return
        }

        // 处理user路由
        const userData = handleUserRouter(req, res)
        if (userData) {
            res.end(JSON.stringify(userData))
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
// export default serverHandle
module.exports = serverHandle