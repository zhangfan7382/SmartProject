const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URL;

const app = express();
const port = 3000;

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// 连接 MongoDB
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('MongoDB连接成功');
}).catch(err => {
  console.error('MongoDB连接失败:', err);
});

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('GridFS初始化完成');
});

// GridFS Storage 配置
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      metadata: { originalname: file.originalname }
    };
  }
});
const upload = multer({ storage });

// 上传文件接口
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有文件被上传' });
    }

    const file = {
      filename: req.file.filename,
      originalname: req.file.metadata.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadTime: new Date()
    };

    const collection = conn.db.collection('files');
    await collection.insertOne(file);

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
    const collection = conn.db.collection('files');
    const files = await collection.find({}).toArray();

    res.json(files.map(file => ({
      id: file.filename,
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      uploadTime: file.uploadTime,
      url: `http://${req.headers.host}/uploads/${file.filename}`
    })));
  } catch (error) {
    console.error('获取文件列表失败:', error);
    res.status(500).json({ error: '获取文件列表失败' });
  }
});

// 下载文件接口，使用 GridFS 流
app.get('/uploads/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: '文件不存在' });

    const readstream = gfs.createReadStream({ filename: file.filename });

    const isHTML = file.filename.toLowerCase().endsWith('.html');
    res.set('Content-Type', isHTML ? 'text/html; charset=utf-8' : file.contentType || 'application/octet-stream');
    res.set('Content-Disposition', `${isHTML ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(file.filename)}`);

    readstream.pipe(res);
  } catch (err) {
    console.error('下载文件失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除文件接口
app.delete('/api/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    const collection = conn.db.collection('files');
    const file = await collection.findOne({ filename });
    if (!file) return res.status(404).json({ error: '文件不存在' });

    await collection.deleteOne({ filename });

    await new Promise((resolve, reject) => {
      gfs.remove({ filename, root: 'uploads' }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({ message: '文件删除成功' });
  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({ error: '删除文件失败' });
  }
});

// 用户 Schema 和 Model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// 注册路由
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: '用户名已存在' });

    // 密码可用 bcrypt 加密，这里示例不加密（你可以根据需要加）
    const user = new User({ username, password, userType: userType || 'user' });
    const savedUser = await user.save();

    res.status(201).json({
      message: '注册成功',
      user: {
        username: savedUser.username,
        userType: savedUser.userType
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ message: '注册失败' });
  }
});

// 登录路由
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: '用户名或密码错误' });

    // 密码对比，示例未加密，直接比较
    if (user.password !== password) return res.status(401).json({ message: '用户名或密码错误' });

    res.json({
      message: '登录成功',
      user: {
        username: user.username,
        userType: user.userType
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '登录失败' });
  }
});

// 清除所有用户数据接口
app.delete('/api/users/clear', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: '所有用户数据已清除' });
  } catch (error) {
    console.error('清除用户数据失败:', error);
    res.status(500).json({ message: '清除用户数据失败' });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 启动服务，监听0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log('可局域网访问地址:');
  console.log(`- 本机访问：http://localhost:${port}`);
  console.log(`- 局域网访问：http://${getLocalIP()}:${port}`);
});

// 获取本机局域网IP函数
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  const results = {};

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        if (!results[name]) results[name] = [];
        results[name].push(net.address);
      }
    }
  }

  for (const name of Object.keys(results)) {
    if (name.toLowerCase().includes('wlan') || name.toLowerCase().includes('wireless')) {
      return results[name][0];
    }
  }

  for (const name of Object.keys(results)) {
    if (results[name].length > 0) {
      return results[name][0];
    }
  }

  return 'localhost';
}
