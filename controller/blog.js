const { exec, escape } = require('../db/mysql')
const { crtTimeFtt } = require('../utils/tools')

// 防止xss攻击(js代码注入)
const xss = require('xss')

const getList = (keyword, recommend, classify, page_size = 10, currentPage = 1) => {
  // let sql = `select * from blogs where 1=1 ` //where 1=1是为了拼接后面的语句块
  // // 注意keyword的位置
  // if (keyword) {
  //   sql += `and title like '%${keyword}%' `
  // }
  // if (recommend) {
  //   sql += `and recommend = '${recommend}' `
  // }
  // sql += `order by createtime desc;`
  let sqlc = `select COUNT(*) from blogs where 1=1 `
  let sqls = `select * from blogs where 1=1 `
  let sqlAdd = ''
  if (keyword) {
    sqlAdd += `and title like '%${keyword}%' `
  }
  if (recommend) {
    sqlAdd += `and recommend = '${recommend}' `
  }
  if (classify && classify != '全部') {
    sqlAdd += `and classify = '${classify}' `
  }
  let sql = sqlc + sqlAdd + ';' + sqls + sqlAdd + `limit ${(currentPage - 1) * page_size}, ${page_size}`;
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
  const recommend = xss(escape(blogData.recommend))
  const classify = xss(escape(blogData.classify))
  const subtitle = xss(escape(blogData.subtitle))
  const createtime = crtTimeFtt() // 格式化后的当前时间
  // const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createtime}','${author}'); `
  const sql = `insert into blogs (title,content,createtime,author,recommend, classify, subtitle) values (${title},${content},'${createtime}',${author},${recommend},${classify}, ${subtitle}); `
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
  const recommend = xss(escape(blogData.recommend))
  const classify = xss(escape(blogData.classify))
  const subtitle = xss(escape(blogData.subtitle))
  const updatetime = crtTimeFtt() // 格式化后的当前时间
  // const sql = `update blogs set title = '${title}', content = '${content}' where id = ${id} `
  const sql = `update blogs set title = ${title}, content = ${content}, updatetime = '${updatetime}', recommend = ${recommend}, classify=${classify}, subtitle=${subtitle}  where id = ${id} `
  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const switchRecommend = (id, recommend) => {
  id = xss(escape(id))
  recommend = xss(escape(recommend))
  const updatetime = crtTimeFtt() // 格式化后的当前时间
  const sql = `update blogs set updatetime = '${updatetime}', recommend = ${recommend} where id = ${id} `
  return exec(sql).then(switchData => {
    if (switchData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  id = xss(escape(id))
  author = xss(escape(author))
  console.log({ id, author })
  // const sql = `delete from blogs where id = ${ id } and author = '${author}' `
  const sql = `delete from blogs where id = ${id} and author = ${author} `

  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const artClassify = () => {
  const sql = 'select classify from blogs'
  return exec(sql).then(classifyList => {
    return classifyList
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  switchRecommend,
  delBlog,
  artClassify
}