import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';// <--- 添加导入
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  // let [state, setState] = useState("")
  let [states, setStates] = useState([])

  // let root_url = window.location.origin
  let dealer_url ="/djangoapp/get_dealers";
  
  let dealer_url_by_state = "/djangoapp/get_dealers/";
 
  const filterDealers = async (state) => {
    dealer_url_by_state = dealer_url_by_state+state;
    console.log(`Filtering dealers by state from: ${dealer_url_by_state}`);
    try{
      const res = await fetch(dealer_url_by_state, {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200 && Array.isArray(retobj.dealers)) {// <--- 增加检查
        let state_dealers = Array.from(retobj.dealers)
        setDealersList(state_dealers)
      } else {
        console.error("Failed to fetch dealers by state or dealers is not an array"); // <--- 修改错误信息}
      } 
    } catch (error) {
      console.error("Error fetching dealers by state:", error);
    }
  };
   

  const get_dealers = async ()=>{
    console.log(`Fetching all dealers from: ${dealer_url}`);
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if (retobj.status === 200 && Array.isArray(retobj.dealers)) { // <--- 增加检查
        let all_dealers = Array.from(retobj.dealers);
        let states = [];
        all_dealers.forEach((dealer) => {
          states.push(dealer.state);
        });
        setStates(Array.from(new Set(states)));
        setDealersList(all_dealers);
      } else {
        console.error("Failed to fetch all dealers or dealers is not an array"); // <--- 修改错误信息
      }
    } catch (error) {
      console.error("Error fetching all dealers:", error);
    }
  };


  useEffect(() => {
    get_dealers();
  },[]);  


let isLoggedIn = sessionStorage.getItem("username") != null;
return (
  <div>
    <Header /> {/* <--- 添加 Header 组件 */}
    <table className='table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Dealer Name</th>
          <th>City</th>
          <th>Address</th>
          <th>Zip</th>
          <th>
            <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
              <option value="" selected disabled hidden>State</option>
              <option value="All">All States</option>
              {states.map(state => (
                <option value={state} key={state}>{state}</option>
              ))}
            </select>
          </th>
          {isLoggedIn && (<th>Review Dealer</th>)}{/* <--- 修改行 */}
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

export default Dealers
