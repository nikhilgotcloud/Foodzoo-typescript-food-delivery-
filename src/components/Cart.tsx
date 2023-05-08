import React, { useContext, useState } from 'react';
import { FoodsContext } from '../context/FoodContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsTrash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useContext(FoodsContext);

  const [quantities, setQuantities] = useState<{ [id: number]: number }>(
    cartItems.reduce<{ [id: number]: number }>((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {})
  );
  const handleCheckout = () => {
    const totalAmount = getTotalAmount();
    // Navigate to the Checkout component
    navigate(`/checkout?totalAmount=${totalAmount}`);
  };
  const increaseQuantity = (id: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      if (newQuantities[id]) {
        newQuantities[id]++;
      } else {
        newQuantities[id] = 1;
      }
      return newQuantities;
    });
  };

  const decreaseQuantity = (id: number) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      newQuantities[id]--;
      return newQuantities;
    });
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * quantities[item.id]);
    }, 0);
  };

  if (cartItems.length === 0) {
    return <div>No items in cart Aren't you Hungry?</div>;
  }
  let del = {
    backgroundColor: 'transparent',
    border: 'none',
  }
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th scope='col'>Image</th>
            <th scope='col'>Name</th>
            <th scope='col'>Price</th>
            <th scope='col'>Quantity</th>
            <th scope='col'>Amount</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => {
            const quantity = quantities[item.id];
            const amount = item.price * quantity;
            return (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} width={60} height={50} />
                </td>
                <td>{item.name}</td>
                <td>
                  <b>₹{item.price}</b>
                </td>
                <td>
                  <div className="input-group">
                    <button className="btn btn-outline-secondary" type="button"
                      onClick={() => decreaseQuantity(item.id)} disabled={quantity === 1}
                    > -
                    </button>
                    <input type="text" className="form-control" value={quantity}
                      readOnly />
                    <button className="btn btn-outline-secondary" type="button"
                      onClick={() => increaseQuantity(item.id)}>+
                    </button>
                  </div>
                </td>
                <td>
                  <b>₹{amount}</b>
                </td>
                <td>
                  <button style={del} onClick={() => removeFromCart(item.id)}><BsTrash size={20} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="text-end">
        <p><b>Total Amount: ₹{getTotalAmount()}</b></p>
        <button type="button" className="btn btn-primary "  onClick={handleCheckout}>Checkout</button>
      </div>
     
    </>

  );
};

export default Cart;
