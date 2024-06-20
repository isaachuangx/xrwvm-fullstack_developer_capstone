import React, { useState, useEffect } from 'react'; // 引入 React 和钩子函数 useState 和 useEffect
import "./Dealers.css"; // 引入 CSS 文件
import "../assets/style.css"; // 引入额外的样式文件
import Header from '../Header/Header'; // 引入 Header 组件
import review_icon from "../assets/reviewicon.png"; // 引入图片资源

const Dealers = () => { // 定义 Dealers 组件
  const [dealersList, setDealersList] = useState([]); // 定义状态 dealersList 用于存储筛选后的 dealer 列表
  const [allDealers, setAllDealers] = useState([]); // 定义状态 allDealers 用于存储所有 dealer 列表
  const [searchTerm, setSearchTerm] = useState(''); // 定义状态 searchTerm 用于存储搜索框输入内容

  const dealer_url = "/djangoapp/get_dealers"; // 定义 API 端点

  const filterDealers = (term) => { // 定义过滤函数，根据输入内容筛选 dealer 列表
    if (term === '') {
      setDealersList(allDealers); // 如果没有输入内容，恢复原始 dealer 列表
    } else {
      const filteredDealers = allDealers.filter(dealer =>
        dealer.state.toLowerCase().includes(term.toLowerCase()) // 忽略大小写匹配州名
      );
      setDealersList(filteredDealers); // 设置筛选后的 dealer 列表
    }
  };

  const get_dealers = async () => { // 异步获取 dealer 数据
    console.log(`Fetching all dealers from: ${dealer_url}`);
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if (res.ok && retobj.status === 200 && Array.isArray(retobj.dealers)) { // 检查响应是否成功并且 dealers 是数组
        const all_dealers = Array.from(retobj.dealers); // 将响应数据转换为数组
        setAllDealers(all_dealers); // 设置 allDealers 状态
        setDealersList(all_dealers); // 设置 dealersList 状态
      } else {
        console.error("Failed to fetch all dealers or dealers is not an array"); // 错误信息
      }
    } catch (error) {
      console.error("Error fetching all dealers:", error);
    }
  };

  useEffect(() => { // 使用 useEffect 钩子在组件挂载时获取 dealer 数据
    get_dealers();
  }, []);

  const handleSearchChange = (e) => { // 处理搜索框内容变化
    const term = e.target.value;
    setSearchTerm(term); // 更新搜索框状态
    filterDealers(term); // 调用过滤函数
  };

  const handleSearchBlur = () => { // 处理搜索框失去焦点事件
    if (searchTerm === '') {
      setDealersList(allDealers); // 恢复原始 dealer 列表
    }
  };

  const isLoggedIn = sessionStorage.getItem("username") != null; // 检查用户是否登录

  return (
    <div>
      <Header /> {/* 渲染 Header 组件 */}
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <input
                type="text"
                placeholder="Search by state" // 搜索框占位符
                value={searchTerm}
                onChange={handleSearchChange} // 绑定输入内容变化事件
                onBlur={handleSearchBlur} // 绑定失去焦点事件
                className="search-input" // 搜索框样式
              />
            </th>
            {isLoggedIn && (<th>Review Dealer</th>)}{/* 条件渲染，只有登录后才显示 */}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <a href={`/dealer/${dealer.id}`} onClick={() => console.log(`Navigating to: /dealer/${dealer.id}`)}>
                  {dealer.full_name}
                </a>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn && (
                <td><a href={`/postreview/${dealer.id}`}><img src={review_icon} className="review_icon" alt="Post Review" /></a></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers; // 导出 Dealers 组件
