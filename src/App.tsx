import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import FoodsContextProvider from './context/FoodContext';
import FoodList from './components/FoodList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Signup from './components/Signup';



const App: React.FC = () => { 
  return (

    <Router>
      {/* <FoodsContextProvider> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/FoodList" element={<FoodList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
        <ToastContainer />
      {/* </FoodsContextProvider> */}
    </Router>
   
  );
};

export default App;