import React, { useState, useEffect } from 'react';
// import { FoodsContext } from '../context/FoodContext';
import FoodDetail from './FoodDetail';
import { Modal, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import Cart from './Cart';
import axios from 'axios';
import { Food } from '../models/Foodmodel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


// interface User {
//     username: string;
//     password: string;
//     role: string;
//   }

const FoodList: React.FC = () => {
 


  // const { foods, addFood } = useContext(FoodsContext);
  const [foods, setFoods] = useState<Food[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [newFood, setNewFood] = useState({
    name: '',
    description: '',
    price: NaN,
    image: ''
  });

  const role = localStorage.getItem('role');
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/food', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const { data } = response;
        if (Array.isArray(data)) {
          let filteredFoods = data;
      if (role === 'admin') {
        const userId = localStorage.getItem('userId');
        filteredFoods = data.filter((food) => food.userId === userId);
      }
      setFoods(filteredFoods);
        //  setFoods(data)

        } else {
          console.error('Invalid response data:', data);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchFoods();
  }, []);

  const handleDelete = async (foodId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:8000/foods/${foodId}`, config);

        setFoods((prevFoods) => prevFoods.filter((food) => food._id !== foodId));

        toast.success('Food item deleted!', {
          position: toast.POSITION.TOP_CENTER,
        });
        
      } else {
        console.error('Token or username not found.');
      }


    } catch (error) {
      console.error('Error deleting food item:', error);
    }
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8000/foods',
        {
          name: newFood.name,
          description: newFood.description,
          price: newFood.price,
          image: newFood.image
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const addedFood = response.data.food;
        setNewFood({
          name: '',
          description: '',
          price: NaN,
          image: ''
        });
        setFoods(prevFoods => [...prevFoods, addedFood]);
        // Close the modal
        handleModalClose();

        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      } else {
        console.error('Failed to add food item:', response.data.error);
        toast.error('Failed to add food item', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      toast.error('Failed to add food item', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
    }
  };

  //     const [currentUser, setCurrentUser] = useState<User | null>(null);

  //    useEffect(() => {
  //   const getCurrentUser = async () => {
  //     try {
  //       const response = await fetch('/user', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           username: 'current_user_username',
  //           password: 'current_user_password'
  //         })
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         setCurrentUser(data.role);
  //       } else {
  //         console.error('Error fetching current user:', response.status);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching current user:', error);
  //     }
  //   };

  //   getCurrentUser();
  // }, []);

  // useEffect(() => {
  //   const currentUserData = localStorage.getItem('currentUser');
  //   if (currentUserData) {
  //     const user: User = JSON.parse(currentUserData);
  //     setCurrentUser(user);
  //   }
  // }, []);


  const handleCartButtonClick = () => {
    setShowCartModal(true);
  };
  const handleCartModalClose = () => {
    setShowCartModal(false);
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    const { name, value } = event.target;
    if (name === 'price') {
      setNewFood({ ...newFood, [name]: parseFloat(value) });
    } else {
      setNewFood({ ...newFood, [name]: value });
    }
  };


  // const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     addFood(newFood);
  //     setNewFood({
  //         id: Date.now(),
  //         name: '',
  //         description: '',
  //         price: NaN,
  //         image: ''
  //       });
  //     handleModalClose();
  // };
  const handleModalOpen = () => {
    setShowModal(true);
  }
  const handleModalClose = () => {
    setShowModal(false);
  }
  const handleFoodUpdate = (updatedFood: Food) => {
    setFoods(prevFoods =>
      prevFoods.map(foodItem => (foodItem._id === updatedFood._id ? updatedFood : foodItem))
    );
  };

  // if (foods.length === 0) {
  //     return <div>No food item found.</div>;
  // }

  let dv = {
    backgroundColor: 'black'
  }
  let wv = {
    color: 'white',
    fontFamily: 'cursive'
  }
  const navigate = useNavigate();


  const handleLogout = () => {

    navigate('/');
    toast.success("You are logged out!!!", {
      position: toast.POSITION.TOP_CENTER,

    });
  };
  return (
    <>

      <nav className="navbar bg-body-dark">
        <div className="container-fluid p-2" style={dv}>
          <h1 className="navbar-brand ms-4" style={wv}>Food Zoo</h1>
          {role === 'user' && (
            <button type="button" className="btn btn-primary" onClick={handleCartButtonClick} style={{ marginLeft: '80%' }} >
              Cart
            </button>)}
          {role === 'admin' && (
            <button type="button" className="btn btn-primary" onClick={handleModalOpen} style={{ marginLeft: '75%' }} >
              Add Food Item
            </button>)}

          <button type="button" className="btn btn-primary" onClick={handleLogout} >
            Logout
          </button>
        </div>
      </nav>
      <div className="d-flex flex-wrap ">
        {foods.map((food: Food) => (
          <FoodDetail key={food._id} food={{ ...food, id: food.id }} handleDelete={handleDelete} handleUpdate={handleFoodUpdate} />
        ))}
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Food Item </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit} method='POST'>
            <FormGroup className="mb-2" controlId="formFoodName">
              <p><b>Food title</b></p>
              <FormControl type="text" placeholder="Enter food name" name="name" value={newFood.name} onChange={handleInputChange} required />
            </FormGroup>

            <FormGroup className="mb-2" controlId="formFoodDescription">
              <p><b>Description</b></p>
              <FormControl as="textarea" placeholder="Enter food description" name="description" value={newFood.description} onChange={handleInputChange} required />
            </FormGroup>

            <FormGroup className="mb-2" controlId="formFoodPrice">
              <p><b> Price</b></p>
              <FormControl type="number" placeholder="Enter food price" name="price" value={isNaN(newFood.price) ? "" : newFood.price.toString()}
                onChange={handleInputChange} required
              />
            </FormGroup>
            <FormGroup className="mb-2" controlId="formFoodImage">
              <p><b> Image </b></p>
              <FormControl type="text" placeholder="Enter food image URL" name="image" value={newFood.image} onChange={handleInputChange} required />
            </FormGroup>
            <Button type="submit">
              Add Food
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* cart modal */}
      <Modal show={showCartModal} onHide={handleCartModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cart />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FoodList;
