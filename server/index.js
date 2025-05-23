const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require("dotenv").config(); // 加载.env
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
// MongoDB连接配置
// mongoose.connect('mongodb://127.0.0.1:27017/sadp_test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000 // 5秒超时
// })

const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // 5秒超时
})
.then(() => {
  console.log('MongoDB连接成功');
  // 初始化 GridFS bucket
  const bucket = new GridFSBucket(mongoose.connection.db);
  console.log('GridFS bucket 初始化成功');
})
.catch(err => {
  console.error('MongoDB连接失败:', err);
});

// 监听MongoDB连接错误
mongoose.connection.on('error', (err) => {
  console.error('MongoDB连接错误:', err);
});

const app = express();
const port = 3000;

// 添加 body-parser 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 启用 CORS
app.use(cors());

// 配置 multer 内存存储
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制文件大小为 10MB
  }
});

// 上传文件接口
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('没有文件被上传');
      return res.status(400).json({ error: '没有文件被上传' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db);
    const filename = `${Date.now()}-${req.file.originalname}`;
    
    // 创建上传流
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        uploadTime: new Date()
      }
    });

    // 写入文件数据
    uploadStream.write(req.file.buffer);
    uploadStream.end();

    // 等待上传完成
    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    res.json({
      message: '文件上传成功',
      file: {
        id: uploadStream.id,
        name: req.file.originalname,
        size: req.file.size,
        uploadTime: new Date()
      }
    });
  } catch (error) {
    console.error('文件上传失败:', error);
    res.status(500).json({ error: '文件上传失败' });
  }
});

// 获取文件列表接口
app.get('/api/files', async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db);
    const files = await bucket.find({}).toArray();
    
    res.json(files.map(file => ({
      id: file._id,
      name: file.metadata.originalname,
      size: file.length,
      uploadTime: file.metadata.uploadTime,
      url: `http://localhost:${port}/api/files/${file._id}`
    })));
  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({ error: '获取文件列表失败' });
  }
});

// 下载文件接口
app.get('/api/files/:id', async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db);
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    // 获取文件信息
    const files = await bucket.find({ _id: fileId }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    const file = files[0];
    
    // 设置响应头
    res.setHeader('Content-Type', file.metadata.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.metadata.originalname)}`);
    
    // 创建下载流
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);
    
    // 处理错误
    downloadStream.on('error', (error) => {
      console.error('文件下载失败:', error);
      res.status(500).json({ error: '文件下载失败' });
    });
  } catch (error) {
    console.error('文件下载失败:', error);
    res.status(500).json({ error: '文件下载失败' });
  }
});

// 删除文件接口
app.delete('/api/files/:id', async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db);
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    // 删除文件
    await bucket.delete(fileId);
    
    res.json({ message: '文件删除成功' });
  } catch (error) {
    console.error('文件删除失败:', error);
    res.status(500).json({ error: '文件删除失败' });
  }
});

// 用户数据存储
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema);

// 注册路由
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, userType } = req.body
    console.log('注册请求数据:', { username, userType }) // 添加日志

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' })
    }

    // 创建新用户
    const newUser = {
      username,
      password,
      userType: userType || 'user' // 确保有默认值
    }
    console.log('准备创建的用户数据:', newUser) // 添加日志

    const user = new User(newUser)
    const savedUser = await user.save()
    console.log('用户注册成功，保存的数据:', savedUser) // 添加日志

    res.status(201).json({ 
      message: '注册成功',
      user: {
        username: savedUser.username,
        userType: savedUser.userType
      }
    })
  } catch (error) {
    console.error('注册失败:', error)
    res.status(500).json({ message: '注册失败' })
  }
})

// 登录路由
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body
    console.log('登录请求:', { username }) // 添加日志

    // 查找用户
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    // 验证密码
    if (user.password !== password) {
      return res.status(401).json({ message: '用户名或密码错误' })
    }

    console.log('用户登录成功:', { username, userType: user.userType }) // 添加日志

    // 登录成功，返回用户信息
    res.json({ 
      message: '登录成功',
      user: {
        username: user.username,
        userType: user.userType
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ message: '登录失败' })
      }
})

// 清除所有用户数据接口
app.delete('/api/users/clear', async (req, res) => {
  try {
    await User.deleteMany({})
    res.json({ message: '所有用户数据已清除' })
  } catch (error) {
    console.error('清除用户数据失败:', error)
    res.status(500).json({ message: '清除用户数据失败' })
  }
})

// 处理未匹配的路由
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 修改监听地址为 0.0.0.0，允许所有网络接口访问
app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log('您可以通过以下地址访问：');
  console.log(`- 本机访问：http://localhost:${port}`);
  console.log(`- 局域网访问：http://${getLocalIP()}:${port}`);
});

// 获取本机局域网 IP 地址
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // 跳过内部 IP 和非 IPv4 地址
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  // 优先返回无线网卡地址
  for (const name of Object.keys(results)) {
    if (name.toLowerCase().includes('wlan') || name.toLowerCase().includes('wireless')) {
      return results[name][0];
    }
  }

  // 如果没有无线网卡，返回第一个找到的地址
  for (const name of Object.keys(results)) {
    if (results[name].length > 0) {
      return results[name][0];
    }
  }

  return 'localhost';
} 