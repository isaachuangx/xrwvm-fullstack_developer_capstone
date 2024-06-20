const express = require('express'); // 引入Express框架
const mongoose = require('mongoose'); // 引入Mongoose库，用于连接和操作MongoDB
const cors = require('cors'); // 引入CORS库，允许跨域资源共享
const app = express(); // 创建Express应用
const port = process.env.PORT || 3050; // 设置服务器端口

app.use(cors()); // 使用CORS中间件，允许跨域请求
app.use(express.json()); // 使用Express内置的JSON解析中间件，解析请求中的JSON数据

// 连接到MongoDB，使用环境变量来设置连接字符串
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
  initializeData(); // 数据库连接成功后，初始化数据
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

const Cars = require('./inventory'); // 引入Car模型文件

// 初始化数据函数，删除旧数据并插入新数据
function initializeData() {
  const carsData = require('./data/car_records.json'); // 引入JSON数据文件

  // 删除旧的Car数据
  Cars.deleteMany({}).then(() => {
    // 插入新的Car数据
    Cars.insertMany(carsData.cars).catch(err => {
      console.error('Error initializing Cars inventory data:', err);
    });
  }).catch(err => {
    console.error("Error deleting Cars inventory data: ", err);
  });
}

// 定义API路由

// 根路由，简单返回欢迎消息
app.get('/', (req, res) => {
  res.send("Welcome to the Mongoose API");
});

// 根据经销商ID获取所有汽车
app.get('/cars/:id', async (req, res) => {
  const id = parseInt(req.params.id); // 从请求参数中获取ID并转换为整数
  try {
    const documents = await Cars.find({ dealer_id : id }); // 在数据库中查找匹配的记录
    res.json(documents); // 返回查询结果
  } catch (error) {
    console.error("Error fetching inventory data", error); // 处理错误
    res.status(500).json({ error: 'Error fetching documents' }); // 返回错误响应
  }
});

// 根据经销商ID和汽车品牌获取汽车
app.get('/carsbymake/:id/:make', async (req, res) => {
  const { id, make } = req.params; // 从请求参数中获取ID和品牌
  try {
    const documents = await Cars.find({ dealer_id: id, make: make }); // 在数据库中查找匹配的记录
    res.json(documents); // 返回查询结果
  } catch (error) {
    console.error("Error fetching cars by make", error); // 处理错误
    res.status(500).json({ error: 'Error fetching cars by make' }); // 返回错误响应
  }
});

// 根据经销商ID和汽车型号获取汽车
app.get('/carsbymodel/:id/:model', async (req, res) => {
  const { id, model } = req.params; // 从请求参数中获取ID和型号
  try {
    const documents = await Cars.find({ dealer_id: id, model: model }); // 在数据库中查找匹配的记录
    res.json(documents); // 返回查询结果
  } catch (error) {
    console.error("Error fetching cars by model", error); // 处理错误
    res.status(500).json({ error: 'Error fetching cars by model' }); // 返回错误响应
  }
});

// 根据经销商ID和最大里程数获取汽车，基于不同的里程范围
app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  const { id, mileage } = req.params; // 从请求参数中获取ID和里程数
  let query = { dealer_id: id }; // 基本查询条件

  // 根据里程范围设置查询条件
  if (mileage <= 50000) {
    query.mileage = { $lte: 50000 };
  } else if (mileage <= 100000) {
    query.mileage = { $gte: 50001, $lte: 100000 };
  } else if (mileage <= 150000) {
    query.mileage = { $gte: 100001, $lte: 150000 };
  } else if (mileage <= 200000) {
    query.mileage = { $gte: 150001, $lte: 200000 };
  } else {
    query.mileage = { $gte: 200001 };
  }

  try {
    const documents = await Cars.find(query); // 在数据库中查找匹配的记录
    res.json(documents); // 返回查询结果
  } catch (error) {
    console.error("Error fetching cars by max mileage", error); // 处理错误
    res.status(500).json({ error: 'Error fetching cars by max mileage' }); // 返回错误响应
  }
});

// 根据经销商ID和最高价格获取汽车，基于不同的价格范围
app.get('/carsbyprice/:id/:price', async (req, res) => {
  const { id, price } = req.params; // 从请求参数中获取ID和价格
  let query = { dealer_id: id }; // 基本查询条件

  // 根据价格范围设置查询条件
  if (price <= 20000) {
    query.price = { $lte: 20000 };
  } else if (price <= 40000) {
    query.price = { $gte: 20001, $lte: 40000 };
  } else if (price <= 60000) {
    query.price = { $gte: 40001, $lte: 60000 };
  } else if (price <= 80000) {
    query.price = { $gte: 60001, $lte: 80000 };
  } else {
    query.price = { $gte: 80001 };
  }

  try {
    const documents = await Cars.find(query); // 在数据库中查找匹配的记录
    res.json(documents); // 返回查询结果
  } catch (error) {
    console.error("Error fetching cars by price", error); // 处理错误
    res.status(500).json({ error: 'Error fetching cars by price' }); // 返回错误响应
  }
});

// 根据经销商ID和年份范围获取汽车
app.get('/carsbyyear/:id/:year', async (req, res) => {
  const { id, year } = req.params; // 从请求参数中获取ID和年份
  const currentYear = new Date().getFullYear(); // 获取当前年份
  let query = { dealer_id: id, year: { $gte: parseInt(year), $lte: currentYear } }; // 设置查询条件，年份范围从指定年份到当前年份

  try {
    const documents = await Cars.find(query); // 在数据库中查找匹配的记录
    res.json(documents); // 返回查询结果
  } catch (error) {
    console.error("Error fetching cars by year", error); // 处理错误
    res.status(500).json({ error: 'Error fetching cars by year' }); // 返回错误响应
  }
});

// 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
