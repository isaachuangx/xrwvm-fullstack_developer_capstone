import React from 'react'; // 引入 React 库
import Header from '../Header/Header'; // 引入 Header 组件
import '../assets/style.css'; // 确保引用 style.css
import './About.css'; // 引入 About 组件的 CSS 文件
import ceoImage from '../assets/CEO.png'; // 引入 CEO 图片资源
import cfoImage from '../assets/CFO.png'; // 引入 CFO 图片资源
import ctoImage from '../assets/CTO.png'; // 引入 CTO 图片资源

const About = () => ( // 定义 About 组件
  <div>
    <Header /> {/* 渲染 Header 组件 */}
    <div className="card"> {/* 定义一个卡片样式的容器 */}
      <div className="banner" name="about-header">
        {/* 可以在这里插入关于页面的横幅内容 */}
      </div>
      <div className="row"> {/* 定义一个行容器来排列卡片 */}
        <div className="card"> {/* 定义 CEO 卡片 */}
          <img className="card-img-top" src={ceoImage} alt="CEO" /> {/* 渲染 CEO 图片 */}
          <div className="card-body"> {/* 定义卡片主体内容的容器 */}
            <p className="title">Jason Kennedy</p> {/* 显示 CEO 名字 */}
            <p>CEO</p> {/* 显示职位 */}
            <p className="card-text">Jason has dedicated 25 years to his career at BEST CAR, progressing from a sales position to his current role as CEO. He has witnessed all the transformations within BEST CAR. Looking ahead, he aspires to bring further changes that will benefit all stakeholders of the company.</p> {/* 显示描述 */}
            <p>JasonKennedy@bestcar.com</p> {/* 显示联系邮箱 */}
          </div>
        </div>

        <div className="card"> {/* 定义 CFO 卡片 */}
          <img className="card-img-top" src={cfoImage} alt="CFO" /> {/* 渲染 CFO 图片 */}
          <div className="card-body">
            <p className="title">Sophie Brown</p>
            <p>CFO</p>
            <p className="card-text">Sophie previously held an executive position at an investment bank. She believes that a company's financial health is tantamount to its lifeline. Under her management, she is confident that the financial system at BEST CAR will become exceptionally robust.</p>
            <p>sophiebrown@bestcar.com</p>
          </div>
        </div>

        <div className="card"> {/* 定义 CTO 卡片 */}
          <img className="card-img-top" src={ctoImage} alt="CTO" /> {/* 渲染 CTO 图片 */}
          <div className="card-body">
            <p className="title">Andy Chen</p>
            <p>CTO</p>
            <p className="card-text">Since joining the company in 2017, Andy has introduced numerous significant technological advancements to BEST CAR. His contributions include assembling a tech team, developing a cutting-edge dealer review website, and enhancing the internal management systems. The new technologies he introduced have enabled BEST CAR to operate more efficiently and have improved user convenience.</p>
            <p>andychen@bestcar.com</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About; // 导出 About 组件