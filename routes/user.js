var express = require('express');
var router = express.Router();
const { login, getUserInfo } = require('../controller/user')
const loginCheck = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 登录
router.post('/login', function (req, res, next) {
  const { username, password } = req.body
  const result = login(username, password)
  return result.then(data => {
    if (data.username) {
      req.session.username = data.username
      req.session.realname = data.realname
      req.session.save();  //保存一下修改后的Session
      res.json(new SuccessModel('登录成功'))
      return
    }
    res.json(new ErrorModel('登陆失败'))
  })
});

// 获取用户信息
router.get('/getInfo', loginCheck, function (req, res, next) {
  const result = getUserInfo(req.session.username)
  return result.then(data => {
    res.json(new SuccessModel(data))
  })
})

router.post('/loginOut', (req, res, next) => {
  res.clearCookie('connect.sid');
  req.session = null;
  res.json(new SuccessModel('登出成功'))
})

// router.get('/login-test', (req, res, next) => {
//   if (req.session.username) {
//     res.json({
//       errno: 0,
//       msg: '已登录'
//     })
//     return
//   }
//   res.json({
//     errno: -1,
//     msg: '未登录'
//   })
// })
// router.get('/session-test', (req, res, next) => {
//   const session = req.session
//   if (session.viewNum == null) {
//     session.viewNum = 0
//   }
//   session.viewNum++
//   res.json(session.viewNum)
// })
module.exports = router;