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

const Reviews = require('./review'); // 更新路径
const Dealerships = require('./dealership'); // 更新路径

// [改进3: 数据初始化抽离成函数进行错误处理]
function initializeData() {
  // 假设已经有这些 JSON 文件，确保实际部署时也包含它们
  const reviewsData = require('./data/reviews.json'); // 更新路径
  const dealershipsData = require('./data/dealerships.json'); // 更新路径

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
  res.send("Welcome to the Mongoose API");
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

app.get('/fetchDealers', async (req, res) => {
  try {
    const dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    console.error("Error fetching dealership data", error);
    res.status(500).json({ error: 'Error fetching dealership data' });
  }
});

// 新加入的API路由

// Fetch reviews by dealer ID - Modified to handle numeric ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
  const id = parseInt(req.params.id); // Added parsing to integer
  try {
    const documents = await Reviews.find({ dealership: id });
    res.json(documents);
  } catch (error) {
    console.error("Error fetching documents by dealer", error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Fetch Dealerships by state
app.get('/fetchDealers/:state', async (req, res) => {
  const state = req.params.state;
  try {
    const dealers = await Dealerships.find({ state: state });
    res.json(dealers);
  } catch (error) {
    console.error("Error fetching dealerships by state", error);
    res.status(500).json({ error: 'Error fetching dealerships data by state' });
  }
});

// Fetch dealer details by ID - Modified to match numeric ID
app.get('/fetchDealer/:id', async (req, res) => {
  const id = parseInt(req.params.id); // Added parsing to integer
  console.log(`Fetching dealer with ID: ${id}`);// Log dealer ID
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is required and must be a number' });
  }
  try {
    const dealer = await Dealerships.findOne({ id: id }); // Query modified to use numeric id
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: 'Dealer Not Found!' });
    }
  } catch (error) {
    console.error("Error fetching dealership data by ID", error);
    res.status(500).json({ error: 'Error fetching dealership data by ID' });
  }
});

// Insert a review
app.post('/insert_review', async (req, res) => {
  const data = req.body;
  const lastReview = await Reviews.findOne().sort({ id: -1 });
  let new_id = lastReview ? lastReview.id + 1 : 1;

  const review = new Reviews({
    id: new_id,
    name: data.name,
    dealership: data.dealership,
    review: data.review,
    purchase: data.purchase,
    purchase_date: data.purchase_date,
    car_make: data.car_make,
    car_model: data.car_model,
    car_year: data.car_year,
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.error("Error inserting review", error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
