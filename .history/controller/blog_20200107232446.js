const { exec, escape } = require('../db/mysql')

// 防止xss攻击(js代码注入)
const xss = require('xss')

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 ` //where 1=1是为了拼接后面的语句块
  // 注意author和keyword的位置
  if (author) {
    author = xss(escape(author))
    // sql += `and author='${author}' `
    sql += `and author=${author} `

  }
  if (keyword) {
    keyword = xss(escape(keyword))
    // sql += `and title like '%${keyword}%' `
    sql += `and title like %${keyword}% `

  }
  sql += `order by createtime desc;`
  console.log(sql)
  // 返回的promise
  return exec(sql) //返回的是数组形式
}

const getDetail = (id) => {
  id = xss(escape(id))
  // const sql = `select * from blogs where id = '${id}'`
  const sql = `select * from blogs where id = ${id}`
  return exec(sql).then(rows => {
    return rows[0]
  })
}

const newBlog = (blogData = {}) => {
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  const author = xss(escape(blogData.author))
  const createtime = Date.now()
  // const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createtime}','${author}'); `
  const sql = `insert into blogs (title,content,createtime,author) values (${title},${content},${createtime},${author}); `
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}

const updateBlog = (id, blogData = {}) => {
  id = xss(escape(id))
  const title = xss(escape(blogData.title))
  const content = xss(escape(blogData.content))
  // const sql = `update blogs set title = '${title}', content = '${content}' where id = ${id} `
  const sql = `update blogs set title = ${title}, content = ${content} where id = ${id} `
  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  id = xss(escape(id))
  author = xss(escape(author))
  console.log({ id, author })
  // const sql = `delete from blogs where id = ${id} and author = '${author}' `
  const sql = `delete from blogs where id = ${id} and author = ${author} `

  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}