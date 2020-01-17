var express = require('express');
var router = express.Router();
// 引入mysql接口
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  switchRecommend,
  delBlog
} = require('../controller/blog')

// 引入数据处理类
const { SuccessModel, ErrorModel } = require('../model/resModel')
// 引入登录校验函数，采用中间件原理进行校验，成功则进一步操作（next），否则返回未登录提醒
const loginCheck = require('../middleware/loginCheck')

// 获取blog列表
router.get('/list', (req, res, next) => {
  let { keyword = '', recommend = '', page_size = 10, page_count = 1 } = req.query
  const result = getList(keyword, recommend, page_size, page_count)
  return result.then(listData => {
    let pagination = {
      total: listData[0][0]['COUNT(*)'],
      page_size: page_size,
      page_count: page_count
    }
    let data = listData[1]
    res.json(new SuccessModel({ pagination, data }))
  })
})

// 获取文章详情
router.get('/detail', (req, res, next) => {
  const id = req.query.id
  if (!id) {
    return Promise.resolve(res.json(new ErrorModel('请传入id')))
  }
  const result = getDetail(id)
  return result.then(detaiData => {
    res.json(new SuccessModel(detaiData))
  })
})

// 新建博客
router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username
  const blogData = req.body
  const { content, title, recommend, classify } = req.body
  if (!content) {
    return Promise.resolve(res.json(new ErrorModel('请传入content')))
  }
  if (!title) {
    return Promise.resolve(res.json(new ErrorModel('请传入title')))
  }
  if (recommend == undefined || recommend == null) {
    return Promise.resolve(res.json(new ErrorModel('请选择是否推荐')))
  }
  if (!classify) {
    return Promise.resolve(res.json(new ErrorModel('请选择文章分类')))
  }
  const result = newBlog(blogData)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

// 更新博客
router.post('/update', loginCheck, (req, res, next) => {
  const id = req.query.id
  const { content, title, recommend, classify } = req.body
  if (!id) {
    return Promise.resolve(res.json(new ErrorModel('请传入id')))
  }
  if (!content) {
    return Promise.resolve(res.json(new ErrorModel('请传入content')))
  }
  if (!title) {
    return Promise.resolve(res.json(new ErrorModel('请传入title')))
  }
  if (recommend == undefined || recommend == null) {
    return Promise.resolve(res.json(new ErrorModel('请选择是否推荐')))
  }
  if (!classify) {
    return Promise.resolve(res.json(new ErrorModel('请选择文章分类')))
  }
  const result = updateBlog(id, req.body)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('更新blog失败'))
    }
  })
})

// 切换文章推荐状态
router.post('/switchRecommend', loginCheck, (req, res, next) => {
  const { id, recommend } = req.body
  if (!id) {
    return Promise.resolve(res.json(new ErrorModel('请传入id')))
  }
  console.log(typeof recommend)
  if (recommend == undefined || recommend == null) {
    return Promise.resolve(res.json(new ErrorModel('请选择是否推荐')))
  }
  const result = switchRecommend(id, recommend)
  return result.then(data => {
    if (data) {
      res.json(new SuccessModel())
    } else {
      res.json(new ErrorModel('更新失败'))
    }
  })
})

// 删除博客
router.post('/del', loginCheck, (req, res, next) => {
  const id = req.query.id
  if (!id) {
    return Promise.resolve(res.json(new ErrorModel('请传入id')))
  }
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