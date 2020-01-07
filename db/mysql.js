const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../conf/db')

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONFIG)

// 开始连接
con.connect()

// 统一执行sql语句的函数
function exec (sql) {
  const promise = new Promise((resolve, reject) => {
    con.query(sql, (err, result) => {
      if (err) {
        reject(err)
        return
      }
      resolve(result)
    })
  })
  return promise
}


// 需要多次连接，所以这里不要关闭
// con.end()

module.exports = {
  exec,
  //安全之1:防止sql注入
  escape: mysql.escape
}