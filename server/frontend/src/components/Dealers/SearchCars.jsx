import React, { useState, useEffect } from 'react'; // 引入 React 和相关钩子函数
import "./Dealers.css"; // 引入样式表
import { useParams, Link } from 'react-router-dom'; // 引入路由钩子函数和 Link 组件
import Header from '../Header/Header'; // 引入 Header 组件

const SearchCars = () => {
  // 定义状态
  const [cars, setCars] = useState([]); // 用于存储车辆库存列表
  const [loading, setLoading] = useState(true); // 指示数据加载状态
  const [error, setError] = useState(null); // 用于存储错误信息
  const [filters, setFilters] = useState({ model: '', make: '', mileage: '', price: '', year: '' }); // 用于存储过滤条件

  const { dealer_id } = useParams(); // 使用 React Router 的 useParams 钩子来获取路由参数

  // 定义获取车辆库存的异步函数
  const fetchCars = async () => {
    // 从过滤条件中获取各项参数
    const { model, make, mileage, price, year } = filters;
    // 构建查询字符串
    let query = `?dealer_id=${dealer_id}`;
    if (model) query += `&model=${model}`;
    if (make) query += `&make=${make}`;
    if (mileage) query += `&mileage=${mileage}`;
    if (price) query += `&price=${price}`;
    if (year) query += `&year=${year}`;

    const inventory_url = `/djangoapp/inventory/${query}`; // 构建 API 请求 URL

    console.log(`Fetching cars inventory from: ${inventory_url}`);
    try {
      const response = await fetch(inventory_url); // 发送请求
      const result = await response.json(); // 获取 JSON 格式的响应
      if (response.ok && result.status === 200) {
        setCars(result.inventory); // 设置车辆库存状态
        setError(null); // 清除错误信息
      } else {
        setCars([]); // 清空车辆库存状态
        setError(result.message || "Failed to load car inventory"); // 设置错误信息
      }
    } catch (error) {
      setCars([]); // 清空车辆库存状态
      setError("Error fetching car inventory: " + error.message); // 设置错误信息
    } finally {
      setLoading(false); // 设置加载状态为 false
    }
  };

  // 使用 useEffect 钩子在组件挂载时和过滤条件变化时获取车辆库存数据
  useEffect(() => {
    fetchCars();
  }, [dealer_id, filters]);

  // 处理过滤条件变化的函数
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // 重置过滤条件的函数
  const handleReset = () => {
    setFilters({ model: '', make: '', mileage: '', price: '', year: '' });
  };

  // 获取车辆库存中唯一的模型、制造商和年份选项
  const uniqueModels = [...new Set(cars.map((car) => car.model))];
  const uniqueMakes = [...new Set(cars.map((car) => car.make))];
  const uniqueYears = [...new Set(cars.map((car) => car.year))];

  return (
    <div>
      <Header /> {/* 渲染 Header 组件 */}
      <div style={{ margin: "20px" }}>
        <h1>Dealer Inventory</h1>
        <div>
          {/* 渲染过滤条件选择菜单 */}
          <select name="model" value={filters.model} onChange={handleFilterChange}>
            <option value="">Select Model</option>
            {uniqueModels.map((model, index) => (
              <option key={index} value={model}>{model}</option>
            ))}
          </select>
          <select name="make" value={filters.make} onChange={handleFilterChange}>
            <option value="">Select Make</option>
            {uniqueMakes.map((make, index) => (
              <option key={index} value={make}>{make}</option>
            ))}
          </select>
          <select name="mileage" value={filters.mileage} onChange={handleFilterChange}>
            <option value="">Select Mileage</option>
            <option value="50000">&lt; 50000 km</option>
            <option value="100000">50000 - 100000 km</option>
            <option value="150000">100000 - 150000 km</option>
            <option value="200000">150000 - 200000 km</option>
            <option value="200001">&gt; 200000 km</option>
          </select>
          <select name="price" value={filters.price} onChange={handleFilterChange}>
            <option value="">Select Price</option>
            <option value="20000">&lt; $20000</option>
            <option value="40000">$20000 - $40000</option>
            <option value="60000">$40000 - $60000</option>
            <option value="80000">$60000 - $80000</option>
            <option value="80001">&gt; $80000</option>
          </select>
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">Select Year</option>
            {uniqueYears.map((year, index) => (
              <option key={index} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={fetchCars}>Filter</button> {/* 过滤按钮 */}
          <button onClick={handleReset}>Reset</button> {/* 重置按钮 */}
        </div>
        {loading ? (
          <p>Loading car inventory...</p> // 显示加载状态
        ) : error ? (
          <p>{error}</p> // 显示错误信息
        ) : (
          cars.length > 0 ? (
            <table className='table'>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Make</th>
                  <th>Mileage</th>
                  <th>Price</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car, index) => (
                  <tr key={index}>
                    <td>{car.model}</td>
                    <td>{car.make}</td>
                    <td>{car.mileage}</td>
                    <td>{car.price}</td>
                    <td>{car.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No inventory found for the given dealer_id.</p> // 无数据时显示的消息
          )
        )}
        <Link to={`/dealer/${dealer_id}`} style={{ display: "block", marginTop: "20px", fontSize: "18px", color: "blue" }}>
          Back
        </Link> {/* 添加返回到 Dealer 页面链接 */}
      </div>
    </div>
  );
};

export default SearchCars; // 导出 SearchCars 组件
