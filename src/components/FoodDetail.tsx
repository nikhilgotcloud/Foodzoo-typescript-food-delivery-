import React, { useContext,useEffect,useState } from 'react';
import { FoodsContext } from '../context/FoodContext';
import { Food } from '../models/Foodmodel';


interface Props {
  food: Food;
}
interface User {
    username: string;
    password: string;
    role: string;
  }

const FoodDetail: React.FC<Props> = ({ food }) => {
    const { addToCart } = useContext(FoodsContext);
    function handleAddToCart() {
    addToCart(food);
    } 
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        const user: User = JSON.parse(currentUserData);
        setCurrentUser(user);
      }
    }, []);
    return (
                <div className="card ms-4 mb-4 mt-3 me-4" style={{ width: '15rem' }} >
                    <img className="card-img-top" src={food.image} alt={food.name} width={50} height={150} />
                    <div className="card-body">
                        <h4>{food.name}</h4>
                        <p>{food.description}</p>
                        <p>Price: <b>₹</b> {food.price}</p>
                        {currentUser?.role === 'user' ? (
                        <button type="button" className="btn btn-primary" onClick={handleAddToCart} >Add to Cart</button>):null}
                    </div>
                </div>
    );
};

export default FoodDetail;
