import React from 'react'; // 引入 React 库
import { Link } from 'react-router-dom'; // 引入 Link 组件，用于导航
import Header from '../Header/Header'; // 引入 Header 组件
import '../assets/style.css'; // 确保引用 style.css
import './Home.css'; // 引入 Home 组件的 CSS 文件
import carDealershipImg from '../assets/car_dealership.jpg'; // 引入图片资源

const Home = () => ( // 定义 Home 组件
  <div>
    <Header /> {/* 渲染 Header 组件 */}
    <div className="home-container"> {/* 定义一个包含页面内容的容器 */}
      <div className="card"> {/* 定义一个卡片样式的容器 */}
        <img src={carDealershipImg} className="card-img-top" alt="Car Dealership" /> {/* 渲染图片 */}
        <div className="card-body"> {/* 定义卡片主体内容的容器 */}
          <h5 className="card-title">Welcome to our Dealerships!</h5> {/* 显示欢迎标题 */}
          <Link to="/dealers" className="btn btn-primary">View Dealerships</Link> {/* 渲染一个按钮链接到 Dealers 页面 */}
        </div>
      </div>
    </div>
  </div>
);

export default Home; // 导出 Home 组件