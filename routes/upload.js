// upload.js
var express = require('express');
var router = express.Router();
const path = require('path');
var fs = require('fs');
var multer = require('multer');
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 接收到文件后输出的保存路径（若不存在则需要创建）
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// 创建文件夹
var createFolder = function (folder) {
  try {
    // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
    // 如果文件路径不存在将会抛出错误"no such file or directory"
    fs.accessSync(folder);
  } catch (e) {
    // 文件夹不存在，以同步的方式创建文件目录。
    fs.mkdirSync(folder);
  }
};

var uploadFolder = './upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

/* POST upload listing. */
// 单文件上传
router.post('/uploadFile/single', upload.single('file'), function (req, res, next) {
  var file = req.file;
  console.log('文件类型：%s', file.mimetype);
  console.log('原始文件名：%s', file.originalname);
  console.log('文件大小：%s', file.size);
  console.log('文件保存路径：%s', file.path);
  // 接收文件成功后返回数据给前端
  return Promise.resolve(res.json(new SuccessModel(file)))
});
// 多文件上传
// router.post('/uploadFile/multiple', upload.array('file', 12), function (req, res, next) {
//   var files = req.files;
//   files.forEach((file, index) => {
//     console.log('index', index)
//     console.log('文件类型：%s', file.mimetype);
//     console.log('原始文件名：%s', file.originalname);
//     console.log('文件大小：%s', file.size);
//     console.log('文件保存路径：%s', file.path);
//   })
//   // 接收文件成功后返回数据给前端
//   res.json({ errno: '0', files });
// });
// 多文件上传
var cpUpload = upload.fields([{ name: 'file', maxCount: 4 }])
router.post('/uploadFile/multiple', cpUpload, function (req, res, next) {
  const files = req.files
  console.log('files--------', files)
  if (req.files.length === 0) {  //判断一下文件是否存在，也可以在前端代码中进行判断。
    return Promise.resolve(res.json(new ErrorModel('上传文件不能为空')))
  }
  // req.files 是一个对象 (String -> Array) 键是文件名，值是文件数组
  // 例如：
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  // req.body 将具有文本域数据，如果存在的话
  return Promise.resolve(res.json(new SuccessModel(files)))
})

router.use('/downloadFile', (req, res, next) => {
  var filename = req.query.filename;
  // var oldname = req.query.oldname;
  // var file = './upload/' + oldname;
  // res.writeHead(200, {
  //   // 'Content-Type': 'application/octet-stream',//告诉浏览器这是一个二进制文件
  //   'Content-Disposition': 'attachment; filename=' + encodeURI(oldname),//告诉浏览器这是一个需要下载的文件
  // });//设置响应头
  // console.log(file)
  // var readStream = fs.createReadStream(file);//得到文件输入流

  // debugger
  // readStream.on('data', (chunk) => {
  //   res.write(chunk, 'binary');//文档内容以二进制的格式写到response的输出流
  //   console.log('我确实传输了')
  // });
  // readStream.on('end', () => {
  //   res.end();
  // })
  // 实现文件下载 
  var fileName = req.query.oldname;
  var filePath = './upload/' + fileName;

  const isFileExit = (filePath) => fs.access(filePath, fs.constants.F_OK, (err) => {
    // console.log(`${filePath} ${err ? '不存在' : '存在'}`);
    console.log(err);
    if (err) {
      return false
    }
    return true
  })
  console.log('isFileExit', isFileExit(filePath))
  // if (!isFileExit(filePath)) {
  //   return Promise.resolve(res.json(new ErrorModel('文件不存在')))
  // }
  var stats = fs.statSync(filePath)
  if (stats.isFile()) {
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': 'attachment; filename=' + encodeURI(fileName),
      'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.end(404);
  }
})
// 导出模块（在 app.js 中引入）
module.exports = router;