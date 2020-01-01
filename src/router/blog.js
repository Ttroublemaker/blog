const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')

const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel('尚未登录'))
  }
}

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id

  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const {
      author = '', keyword = ''
    } = req.query
    const result = getList(author, keyword)
    return result.then(listData => {
      return new SuccessModel(listData)
    })
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id)
    return result.then(detaiData => {
      return new SuccessModel(detaiData)

    })
  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const loginCheckResult = loginCheck(req)
    // 未登录
    if (loginCheckResult) {
      return loginCheckResult
    }
    req.body.author = req.session.username
    const blogData = req.body
    const result = newBlog(blogData)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const loginCheckResult = loginCheck(req)
    // 未登录
    if (loginCheckResult) {
      return loginCheckResult
    }
    const result = updateBlog(id, req.body)
    return result.then(data => {
      if (data) {
        return new SuccessModel()
      } else {
        return new ErrorModel('更新blog失败')
      }
    })
  }

  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const loginCheckResult = loginCheck(req)
    // 未登录
    if (loginCheckResult) {
      return loginCheckResult
    }
    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(data => {
      if (data) {
        return new SuccessModel()
      } else {
        return new ErrorModel('删除blog失败')
      }
    })
  }
}

module.exports = handleBlogRouter