"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

const handleUserRouter = (req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split('?')[0]; // 获取博客列表

  if (method === 'POST' && path === '/api/user/login') {
    return {
      msg: '这是登录的接口'
    };
  }
};

var _default = handleUserRouter; // module.exports = handleUserRouter

exports.default = _default;