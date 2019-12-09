const loginCheck = (username, password) => {
  console.log("2",username, password)
  if (username === 'zhangsan' && password === '123456') {
    return true
  }
  return false
}

module.exports = {
  loginCheck
}