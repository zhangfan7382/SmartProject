const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
require("dotenv").config(); // 加载.env
const mongoose = require('mongoose');
// MongoDB连接配置
// mongoose.connect('mongodb://127.0.0.1:27017/sadp_test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 5000 // 5秒超时
// })

const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB连接成功');
})
.catch(err => {
  console.error('MongoDB连接失败:', err);
});

// 监听MongoDB连接错误
mongoose.connection.on('error', (err) => {
  console.error('MongoDB连接错误:', err);
});

const app = express();
const port = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: ['https://smartproject.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置文件存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // 解码文件名
    const decodedName = Buffer.from(file.originalname, 'binary').toString('utf8');
    // 生成唯一文件名
    const uniqueName = `${Date.now()}-${decodedName}`;
    console.log('生成的文件名:', uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('接收到的文件信息:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    cb(null, true);
  }
});

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 处理 SPA 路由
app.get('*', (req, res, next) => {
  // 如果是 API 请求，继续处理
  if (req.path.startsWith('/api/')) {
    return next();
  }
  // 如果是静态资源请求，继续处理
  if (req.path.startsWith('/uploads/')) {
    return next();
  }
  // 如果是 hash 路由，返回 index.html
  if (req.path.includes('#')) {
    return res.sendFile(path.join(__dirname, '../vue-project/dist/index.html'));
  }
  // 其他所有请求都返回 index.html
  res.sendFile(path.join(__dirname, '../vue-project/dist/index.html'));
});

// 静态文件服务中间件
app.use('/uploads', (req, res, next) => {
  // 解码URL并获取文件名
  const filename = decodeURIComponent(path.basename(req.url));
  const filePath = path.join(__dirname, 'uploads', filename);
  
  console.log('请求下载文件:', {
    requestUrl: req.url,
    decodedFilename: filename,
    fullPath: filePath
  });
  
  // 检查文件是否存在
  if (fs.existsSync(filePath)) {
    console.log('文件存在，准备发送');
    // 判断文件类型
    if (filename.toLowerCase().endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(filename)}`);
    } else {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`);
    }
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // 发送文件
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('发送文件失败:', err);
        next(err);
      } else {
        console.log('文件发送成功');
      }
    });
  } else {
    console.log('文件不存在:', filePath);
    res.status(404).json({ error: '文件不存在' });
  }
});

// 上传文件接口
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.log('没有文件被上传');
      return res.status(400).json({ error: '没有文件被上传' });
    }

    // 解码文件名
    const decodedOriginalName = Buffer.from(req.file.originalname, 'binary').toString('utf8');
    console.log('收到上传文件:', {
      ...req.file,
      originalname: decodedOriginalName
    });

    const file = {
      filename: req.file.filename,
      originalname: decodedOriginalName,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadTime: new Date()
    };

    console.log('准备保存到数据库的文件信息:', file);

    // 保存到数据库
    const db = mongoose.connection;
    const collection = db.collection('files');
    const result = await collection.insertOne(file);
    console.log('数据库保存结果:', result);

    res.json({
      message: '文件上传成功',
      file: {
        id: file.filename,
        name: file.originalname,
        size: file.size,
        uploadTime: file.uploadTime
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
    const db = mongoose.connection;
    const collection = db.collection('files');
    const files = await collection.find({}).toArray();
    
    // console.log('数据库中的文件列表:', files);
    
    res.json(files.map(file => ({
      id: file.filename,
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      uploadTime: file.uploadTime,
      url: `http://localhost:${port}/uploads/${file.filename}`
    })));
  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({ error: '获取文件列表失败' });
  }
});

// 删除文件接口
app.delete('/api/files/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join('uploads', filename);

  try {
    console.log('收到删除请求，文件名:', filename);
    console.log('文件完整路径:', filepath);

    // 从数据库删除
    const db = mongoose.connection;
    const collection = db.collection('files');
    
    // 先检查文件是否存在于数据库中
    const file = await collection.findOne({ filename: filename });
    console.log('数据库中的文件记录:', file);
    
    if (!file) {
      console.log('数据库中未找到文件记录');
      return res.status(404).json({ error: '文件不存在' });
    }

    // 删除数据库记录
    const deleteResult = await collection.deleteOne({ filename: filename });
    console.log('数据库删除结果:', deleteResult);

    // 删除物理文件
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      console.log('物理文件删除成功');
    } else {
      console.log('物理文件不存在:', filepath);
    }

    res.json({ message: '文件删除成功' });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ error: '删除文件失败' });
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