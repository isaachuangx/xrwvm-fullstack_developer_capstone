import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // 引入 Link 组件
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);
  const [carCount, setCarCount] = useState(0); // 定义状态 carCount 用于存储当前库存数量

  const { id } = useParams();  // 使用 React Router 的 useParams 钩子来获取路由参数。
  const root_url = window.location.href.substring(0, window.location.href.indexOf("dealer"));
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
  const inventory_url = `${root_url}djangoapp/inventory/?dealer_id=${id}`; // 添加获取库存数量的 URL
  const post_review_url = `${root_url}postreview/${id}`;

  const get_dealer = async () => {
    console.log(`Fetching dealer data from: ${dealer_url}`);
    try {
      const response = await fetch(dealer_url);
      const result = await response.json();
      if (response.ok && result.dealer) {
        setDealer(result.dealer);
      } else {
        console.error('Failed to load dealer data:', result);
        setDealer(null);
      }
    } catch (error) {
      console.error('Error fetching dealer:', error);
      setDealer(null);
    }
  };

  const get_reviews = async () => {
    console.log(`Fetching reviews data from: ${reviews_url}`);
    try {
      const response = await fetch(reviews_url);
      const result = await response.json();
      if (response.ok && result.reviews.length > 0) {
        setReviews(result.reviews);
        setUnreviewed(false);
      } else {
        setReviews([]);
        setUnreviewed(true);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      setUnreviewed(true);
    }
  };

  const get_inventory_count = async () => {
    console.log(`Fetching inventory count from: ${inventory_url}`);
    try {
      const response = await fetch(inventory_url);
      const result = await response.json();
      if (response.ok && result.status === 200) {
        setCarCount(result.inventory.length); // 设置库存数量
      } else {
        setCarCount(0);
        console.error('Failed to load inventory count:', result);
      }
    } catch (error) {
      setCarCount(0);
      console.error('Error fetching inventory count:', error);
    }
  };

  const senti_icon = (sentiment) => {
    return sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
    get_inventory_count();
    if (sessionStorage.getItem("username")) {
      setPostReview(<a href={post_review_url}><img src={review_icon} style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }} alt='Post Review' /></a>);
    }
  }, [id]);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        {dealer ? (
          <>
            <h1 style={{ color: "grey" }}>{dealer.full_name}{postReview}</h1>
            <h4 style={{ color: "grey" }}>{dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}</h4>
            <p>Current cars in stock: {carCount}</p> {/* 显示库存数量 */}
            <Link to={`/inventory/${id}`} style={{ display: "block", marginTop: "20px", fontSize: "18px", color: "blue" }}>
              Search Cars
            </Link>
            <Link to="/dealers" style={{ display: "block", marginTop: "10px", fontSize: "18px", color: "blue" }}>
              Back
            </Link> {/* 添加返回到 Dealers 页面链接 */}
          </>
        ) : (
          <h1>Loading dealer information...</h1>
        )}
      </div>
      <div className="reviews_panel">
        {unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
