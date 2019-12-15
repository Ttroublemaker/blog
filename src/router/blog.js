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

const handleBlogRouter = (req, res) => {
  const method = req.method
  const id = req.query.id

  // 获取博客列表
  if (method === 'GET' && req.path === '/api/blog/list') {
    const {
      author = '', keyword = ''
    } = req.query
    // const listData = getList(author, keyword)
    // return new SuccessModel(listData)
    // promise对象改写
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
    req.body.author = 'zhangsan' // 先用假数据
    const blogData = req.body
    const result = newBlog(blogData)
    return result.then(data => {
      return new SuccessModel(data)
    })
  }

  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
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
    const author = 'zhongyue' //先用假数据
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