const getList = (auther, ketword) => {
  // 假数据模拟
  return [{
    id: 1,
    title: '标题1',
    content: '内容1',
    createTime: 1575813674212,
    author: '张三'
  }, {
    id: 2,
    title: '标题2',
    content: '内容2',
    createTime: 1575813634212,
    author: '李四'
  }, {
    id: 3,
    title: '标题3',
    content: '内容3',
    createTime: 1575413674212,
    author: '王二'
  }]
}

const getDetail = (id) => {
  return [{
    id: 1,
    title: '标题1',
    content: '内容1',
    createTime: 1575813674212,
    author: '张三'
  }, {
    id: 2,
    title: 'getDetail标题2',
    content: '内容2',
    createTime: 1575813634212,
    author: '李四'
  }, {
    id: 3,
    title: '标题3',
    content: '内容3',
    createTime: 1575413674212,
    author: '王二'
  }]
}

const newBlog = (blogData = {}) => {
  return {
    id: 4,
    content: '我是新建的第四条'
  }
}

const updateBlog = (id, blogData = {}) => {
  console.log(id, blogData)
  return true
}

const delBlog = (id) => {
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}