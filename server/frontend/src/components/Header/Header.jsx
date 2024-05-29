import React from 'react';
import "../assets/style.css";
import "../assets/bootstrap.min.css";
import { Link } from 'react-router-dom'; // <--- 新增导入

const Header = () => {
    const logout = async (e) => {
    e.preventDefault();
    let logout_url = window.location.origin+"/djangoapp/logout";
    const res = await fetch(logout_url, {
      method: "GET",
    });
  
    const json = await res.json();
    if (json) {
      let username = sessionStorage.getItem('username');
      sessionStorage.removeItem('username');
      window.location.href = window.location.origin;
      window.location.reload();
      alert("Logging out "+username+"...")
    }
    else {
      alert("The user could not be logged out.")
    }
  };
    
//The default home page items are the login details panel
let home_page_items =  <div></div>

//Gets the username in the current session
let curr_user = sessionStorage.getItem('username')

//If the user is logged in, show the username and logout option on home page
if ( curr_user !== null &&  curr_user !== "") {
    home_page_items = <div className="input_panel">
      <text className='username'>{sessionStorage.getItem("username")}</text>
    <a className="nav_item" href="/djangoapp/logout" onClick={logout}>Logout</a>
  </div>
} else {
  home_page_items = <div className="input_panel"> {/* <--- 新增 else 块 */}
    <Link className="nav_item" to="/login">Login</Link> {/* <--- 修改行 */}
    <Link className="nav_item" to="/register">Register</Link> {/* <--- 修改行 */}
  </div>
}
    return (
        <div>
          <nav class="navbar navbar-expand-lg navbar-light" style={{backgroundColor:"darkturquoise",height:"1in"}}>
            <div class="container-fluid">
              <h2 style={{paddingRight: "5%"}}>Dealerships</h2>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarText">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <Link className="nav-link active" style={{fontSize: "larger"}} aria-current="page" to="/">Home</Link> {/* <--- 修改行 */}
                  </li>
                  <li class="nav-item">
                    <Link className="nav-link" style={{fontSize: "larger"}} to="/about">About Us</Link> {/* <--- 修改行 */}
                  </li>
                  <li class="nav-item">
                  <Link className="nav-link" style={{fontSize: "larger"}} to="/contact">Contact Us</Link> {/* <--- 修改行 */}
                  </li>
                </ul>
                <span class="navbar-text">
                  <div class="loginlink" id="loginlogout">
                    {home_page_items} {/* <--- 修改了这一行 */}
                  </div>
                  </span>
              </div>
            </div>
          </nav>
        </div>
    )
}

export default Header
