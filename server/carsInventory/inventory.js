// 从mongodb模块中导入Int32，虽然在这段代码中并没有使用这个导入的模块
const { Int32 } = require('mongodb');

// 导入mongoose模块，用于与MongoDB数据库交互
const mongoose = require('mongoose');

// 从mongoose中提取Schema构造函数，用于定义文档的结构
const Schema = mongoose.Schema;

// 创建一个新的Schema对象，用于描述汽车库存文档的结构
const cars = new Schema({
  // dealer_id字段，表示汽车经销商的ID，类型为Number，且为必填字段
  dealer_id: {
    type: Number,
    required: true
  },
  // make字段，表示汽车品牌，类型为String，且为必填字段
  make: {
    type: String,
    required: true
  },
  // model字段，表示汽车型号，类型为String，且为必填字段
  model: {
    type: String,
    required: true
  },
  // bodyType字段，表示汽车车身类型，类型为String，且为必填字段
  bodyType: {
    type: String,
    required: true
  },
  // year字段，表示汽车生产年份，类型为Number，且为必填字段
  year: {
    type: Number,
    required: true
  },
  // mileage字段，表示汽车里程，类型为Number，且为必填字段
  mileage: {
    type: Number,
    required: true
  },
  // price字段，表示汽车价格，类型为Number，且为必填字段
  price: {
    type: Number,
    required: true
  }
});

// 导出一个名为'cars'的Mongoose模型，模型名称为'cars'，结构为定义的cars Schema
module.exports = mongoose.model('cars', cars);
