// 引入加密库
const crypto = require('crypto')

// 密钥
const SECRECT_KEY = 'zy3124c123313124v14v'

// md5加密
function md5 (content) {
  let md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex') //'hex': 将每个字节编码成两个十六进制的字符。
}

// 加密函数
function gemPassword (password) {
  // 将password和密钥通过一定规则拼接起来
  const str = `password=${password}&key=${SECRECT_KEY}`
  // 进行md5加密
  return md5(str)
}
const result = gemPassword('123')
console.log('123', result)
module.exports = {
  gemPassword
}