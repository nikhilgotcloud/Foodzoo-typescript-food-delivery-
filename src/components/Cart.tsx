
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Carts } from '../models/Foodmodel';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<Carts[]>([]);
  const navigate= useNavigate();
  useEffect(() => {
    fetchCartItems();
  }, []);
  
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const response = await axios.get('http://localhost:8000/cart', config);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  
  let del = {
        backgroundColor: 'transparent',
        border: 'none',
        color:'red'
      }

      const increaseQuantity = async (foodId: string) => {
        try {
          const token = localStorage.getItem('token'); 
          await axios.put(`http://localhost:8000/cart/${foodId}/increase`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchCartItems();
        } catch (error) {
          console.error('Error increasing item from cart:', error);
        }
      };
      

      const decreaseQuantity = async (foodId: string) => {
        try {
          const token = localStorage.getItem('token'); 
          await axios.put(`http://localhost:8000/cart/${foodId}/decrease`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchCartItems();
        } catch (error) {
          console.error('Error decreasing item from cart:', error);
        }
      };
      const updateQuantity = async (foodId: string, quantity: number) => {
        
        if (isNaN(quantity)) {
         
          return;
        }
        try {
          const token = localStorage.getItem('token'); 
          await axios.put(`http://localhost:8000/cart/${foodId}`,{quantity}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchCartItems();
        } catch (error) {
          console.error('Error updating item from cart:', error);
        }
      };
      
      const removeFromCart = async (foodId: string) => {
        try {
          const token = localStorage.getItem('token'); 
          await axios.delete(`http://localhost:8000/cart/${foodId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchCartItems();
        } catch (error) {
          console.error('Error removing item from cart:', error);
        }
      };
      

      const getTotalAmount = (): number => {
        return cartItems.reduce((total, item) => {
          const amount = item.price * (item.quantity ?? 0);
          return total + amount;
        }, 0);
      };
      const handleCheckout = () => {
            const totalAmount = getTotalAmount();
            navigate(`/checkout?totalAmount=${totalAmount}`);
          };
  return (
    <>

      {cartItems.length === 0 ? (
        <div><b>No items in cart. Aren't you hungry?</b></div>
      ) : (
        <div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Item</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img src={item.image} alt={item.name} width={60} height={50} />
                </td>
                <td>{item.name}</td>
                <td>₹{item.price}</td>
                <td>
                   <div className="input-group">
                     <button className="btn btn-outline-secondary" type="button"
                      onClick={() => decreaseQuantity(item._id)} 
                      disabled={item.quantity === 1}
                    > -
                    </button>
                    <input type="number"
              value={item.quantity ?? 0}
              onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))} style={{ width: '50px' }} />
                    <button className="btn btn-outline-secondary" type="button"
                      onClick={() => increaseQuantity(item._id)}
                      >+
                    </button>
                  </div>
                </td>
                
                <td><b>₹{item.price * (item.quantity ?? 0)}</b> </td>
                <td>
                <button style={del} 
                onClick={() => removeFromCart(item._id)}
                ><BsTrash size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
       <p><b>Total Amount: ₹{getTotalAmount()}</b></p>
         <button type="button" className="btn btn-primary "  onClick={handleCheckout}>Checkout</button>
       </div>
        </div>
        
      )}
     
   
    </>
  );
};

export default Cart;
