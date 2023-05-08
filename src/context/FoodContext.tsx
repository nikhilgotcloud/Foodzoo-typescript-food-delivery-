import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Food } from '../models/Foodmodel';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type FoodsContextType = {
  foods: Food[];
  addFood: (food: Food) => void;
  cartItems: Food[];
  setCartItems: React.Dispatch<React.SetStateAction<Food[]>>;
  addToCart: (food: Food) => void;
  removeFromCart: (id: number) => void;
};

export const FoodsContext = createContext<FoodsContextType>({
  foods: [],
  cartItems: [],
  addFood: () => { },
  addToCart: () => { },
  removeFromCart: () => { },
  setCartItems: () => {},
});

interface Props {
  children: React.ReactNode;
}

const FoodsContextProvider: React.FC<Props> = ({ children }) => {
  const [foodsList, setFoodsList] = useState<Food[]>([]);
  const [cartItems, setCartItems] = useState<Food[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/foodData.json');
        setFoodsList(response.data.foods);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const addFood = (food: Food) => {
    setFoodsList([...foodsList, food]);
  };

  const addToCart = (food: Food) => {
    const existingItem = cartItems.find((item) => item.id === food.id);

    if (existingItem) {

      if (existingItem.quantity === undefined) {
        existingItem.quantity = 0;
      }
      existingItem.quantity += 1;
      setCartItems([...cartItems]);


      toast.warn(`${food.name} already exists in the cart, please update quantity`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    } else {

      setCartItems([...cartItems, food]);

      toast.success(`${food.name} added to cart!`, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
    }

  };

  const removeFromCart = (id: number) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
  };
  const value = {
    foods: foodsList,
    cartItems,
    addFood,
    addToCart,
    removeFromCart,
    setCartItems,
  };

  return (
    <FoodsContext.Provider value={value}>
      {children}
    </FoodsContext.Provider>
  );
};

export default FoodsContextProvider;
