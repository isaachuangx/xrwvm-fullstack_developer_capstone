const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // 确保跨源资源共享（CORS）问题不会阻碍前端访问
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json()); // 使用 express 内置的中间件来解析 JSON

// [改进1: 数据库连接增加错误处理和配置]
mongoose.connect("mongodb://mongo_db:27017/dealershipsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB successfully");
  initializeData(); // [改进2: 连接成功后初始化数据]
}).catch(err => {
  console.error("Error connecting to MongoDB", err);
});

const Reviews = require('./review');
const Dealerships = require('./dealership');

// [改进3: 数据初始化抽离成函数进行错误处理]
function initializeData() {
  // 假设已经有这些 JSON 文件，确保实际部署时也包含它们
  const reviewsData = require('./reviews.json');
  const dealershipsData = require('./dealerships.json');

  Reviews.deleteMany({}).then(() => {
    Reviews.insertMany(reviewsData.reviews).catch(err => {
      console.error('Error initializing reviews:', err);
    });
  });

  Dealerships.deleteMany({}).then(() => {
    Dealerships.insertMany(dealershipsData.dealerships).catch(err => {
      console.error('Error initializing dealerships:', err);
    });
  }).catch(err => {
    console.error("Error deleting old dealerships data", err);
  });
}

// [改进4: 优化错误处理和日志记录在 API 路由中]
app.get('/', (req, res) => {
    res.send("Welcome to the Mongoose API")
});

app.get('/fetchReviews', async (req, res) => {
  try {
    const documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    console.error("Error fetching reviews", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// 重复的 API 路由，类似地进行优化
app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    console.error("Error fetching dealership data", error);
    res.status(500).json({ error: 'Error fetching dealership data' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});