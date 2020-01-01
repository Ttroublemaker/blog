const {
  exec,
  escape
} = require('../db/mysql')

// 防止xss攻击(js代码注入)
const xss = require('xss')

const login = (username, password) => {
  // 防止sql注入(escape对某些特殊代码进行处理)
  username = xss(escape(username))
  password = xss(escape(password))
  // 使用escape后需要去掉${}两侧的单引号**
  // const sql = `select username,realname from users where username = '${username}' and password = '${password}'`
  const sql = `select username,realname from users where username = ${username} and password = ${password}`
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = {
  login
}