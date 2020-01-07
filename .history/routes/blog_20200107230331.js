var express = require('express');
var router = express.Router();
// 引入mysql接口
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/blog')

// 引入数据处理类
const { SuccessModel, ErrorModel } = require('../model/resModel')
// 引入登录校验函数，采用中间件原理进行校验，成功则进一步操作（next），否则返回未登录提醒
const loginCheck = require('../middleware/loginCheck')

// 获取blog列表
router.get('/list', loginCheck, (req, res, next) => {
  let { author = '', keyword = '' } = req.query
  const result = getList(author, keyword)
  return result.then(listData => {
    res.json(new SuccessModel(listData))
  })
})

// 获取文章详情
router.get('/detail', loginCheck, (req, res, next) => {
  const id = req.query.id
  const result = getDetail(id)
  return result.then(detaiData => {
    res.json(new SuccessModel(detaiData))
  })
})

// 新建博客
router.post('/new', (req, res, next) => {
  req.body.author = 'zhangsan' || req.session.username
  const blogData = req.body
  const result = newBlog(blogData)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

// 更新博客
router.post('/update', loginCheck, (req, res, next) => {
  const id = req.query.id
  const result = updateBlog(id, req.body)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('更新blog失败'))
    }
  })
})

// 删除博客
router.post('/del', loginCheck, (req, res, next) => {
  const id = req.query.id
  const author = req.session.username
  const result = delBlog(id, author)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('删除blog失败'))
    }
  })
})

module.exports = router;