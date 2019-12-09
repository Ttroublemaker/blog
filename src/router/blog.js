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
    const listData = getList(author, keyword)
    return new SuccessModel(listData)
  }

  // 获取博客详情
  if (method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id
    const detaiData = getDetail(id)
    return new SuccessModel(detaiData)
  }

  // 新建博客
  if (method === 'POST' && req.path === '/api/blog/new') {
    const blogData = req.body
    return new SuccessModel(blogData)
  }

  // 更新博客
  if (method === 'POST' && req.path === '/api/blog/update') {
    const result = updateBlog(id, req.body)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('更新blog失败')
    }
  }

  // 删除博客
  if (method === 'POST' && req.path === '/api/blog/del') {
    const result = delBlog(id)
    if (result) {
      return new SuccessModel()
    } else {
      return new ErrorModel('删除blog失败')
    }
  }
}

// export default handleBlogRouter
module.exports = handleBlogRouter