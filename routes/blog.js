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
const {
  SuccessModel,
  ErrorModel
} = require('../model/resModel')

// 获取blog列表
router.get('/list', function (req, res, next) {
  let {
    author = '',
      keyword = ''
  } = req.query
  const result = getList(author, keyword)
  return result.then(listData => {
    res.json(new SuccessModel(listData))
  })
});


router.get('/detail', function (req, res, next) {
  res.json({
    errno: 0,
    data: 'ok'
  })
});
module.exports = router;