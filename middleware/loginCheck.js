const { ErrorModel } = require('../model/resModel')
module.exports = (req, res, next) => {
  console.log(req.session.username)
  if (req.session.username) {
    next()
  } else {
    res.json(new ErrorModel('未登录'))
  }
}