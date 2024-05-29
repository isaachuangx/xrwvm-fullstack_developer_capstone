import Register from "./components/Register/Register";
import LoginPanel from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";

function App() {
  return (
    <Routes>
      <Route path="/" element={<iframe src="/static/Home.html" style={{ width: '100%', height: '100vh', border: 'none' }} />} />
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/postreview/:id" element={<PostReview />} />
      <Route path="/about" element={<iframe src="/static/About.html" style={{ width: '100%', height: '100vh', border: 'none' }} />} />
      <Route path="/contact" element={<iframe src="/static/Contact.html" style={{ width: '100%', height: '100vh', border: 'none' }} />} />
    </Routes>
  );
}

export default App;
