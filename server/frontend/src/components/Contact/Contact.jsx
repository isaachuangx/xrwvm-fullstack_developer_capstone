import React from 'react'; // 引入 React 库
import Header from '../Header/Header'; // 引入 Header 组件
import '../assets/style.css'; // 确保引用 style.css
import './Contact.css'; // 引入 Contact 组件的 CSS 文件
import carDealershipImage from '../assets/car_dealership.jpg'; // 引入 car_dealership 图片资源
import contactUsImage from '../assets/contactus.png'; // 引入 contactus 图片资源

const Contact = () => ( // 定义 Contact 组件
  <div>
    <Header /> {/* 渲染 Header 组件 */}
    <div className="container my-4"> {/* 定义一个容器来包含页面内容 */}
      <div className="card mx-auto"> {/* 定义一个卡片样式的容器 */}
        <div className="card-body"> {/* 定义卡片主体内容的容器 */}
          <img src={carDealershipImage} alt="Car Dealership" style={{ width: '500px', height: '300px', display: 'block', margin: 'auto' }} /> {/* 渲染图片 */}
          <div style={{ height: '1px', backgroundColor: '#ccc', width: '100%', margin: '10px 0' }}></div> {/* 分割线 */}
          <div className="row"> {/* 定义一个行容器来排列内容 */}
            <div className="col-sm-7" style={{ borderRight: '1px solid #ccc' }}> {/* 定义左边栏 */}
              <img src={contactUsImage} alt="Contact Us" style={{ width: '250px', height: '250px', display: 'block', margin: 'auto' }} /> {/* 渲染图片 */}
            </div>
            <div className="col-sm-5" style={{ textAlign: 'center', fontSize: '17px', color: '#0585da' }}> {/* 定义右边栏 */}
              <h4>Contact Information</h4> {/* 联系信息标题 */}
              <div className="contact-item">
                Contact Customer Service:<br />
                <a href="mailto:support@bestcars.com">support@bestcars.com</a> {/* 客服邮箱链接 */}
              </div>
              <div className="contact-item">
                Contact our National Advertising team:<br />
                <a href="mailto:NationalSales@bestcars.com">NationalSales@bestcars.com</a> {/* 广告团队邮箱链接 */}
              </div>
              <div className="contact-item">
                Contact our Public Relations team:<br />
                <a href="mailto:PR@bestcars.com">PR@bestcars.com</a> {/* 公共关系团队邮箱链接 */}
              </div>
              <div className="contact-item">
                Contact the bestcars.com offices:<br />
                <a href="tel:+312-611-1111">312-611-1111</a> {/* 办公电话 */}
              </div>
              <div className="contact-item">
                Become a bestcars.com car dealer:<br />
                <a href="https://www.growwithbestcars.com">Visit www.growwithbestcars.com</a> {/* 成为经销商链接 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contact; // 导出 Contact 组件