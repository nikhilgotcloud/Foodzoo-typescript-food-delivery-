import React, { useContext, useState,useEffect } from 'react';
import { FoodsContext } from '../context/FoodContext';
import FoodDetail from './FoodDetail';
import { Modal, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import Cart from './Cart';
 
interface User {
    username: string;
    password: string;
    role: string;
  }
const FoodList: React.FC = () => {
    const { foods, addFood } = useContext(FoodsContext);
    const [showModal, setShowModal] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
      const currentUserData = localStorage.getItem('currentUser');
      if (currentUserData) {
        const user: User = JSON.parse(currentUserData);
        setCurrentUser(user);
      }
    }, []);
    
    const [newFood, setNewFood] = useState({
        id: Date.now(),
        name: '',
        description: '',
        price: NaN,
        image: ''
    });

    const handleCartButtonClick = () => {
        setShowCartModal(true);
    };
    const handleCartModalClose = () => {
        setShowCartModal(false);
    };
    
      const handleInputChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
          const { name, value } = event.target;
          if (name === "price") {
              setNewFood({ ...newFood, [name]: parseFloat(value) });
          } else {
              setNewFood({ ...newFood, [name]: value });
          }
      };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addFood(newFood);
        setNewFood({
            id: Date.now(),
            name: '',
            description: '',
            price: NaN,
            image: ''
          });
        handleModalClose();
    };


    const handleModalOpen = () => {
        setShowModal(true);
    }
    const handleModalClose = () => {
        setShowModal(false);
    }

    if (foods.length === 0) {
        return <div>No food item found.</div>;
    }

    let dv = {
        backgroundColor: 'black'
    }
    let wv = {
        color: 'white',
        fontFamily:'cursive'
    }

    return (
        <>
            <nav className="navbar bg-body-dark">
                <div className="container-fluid p-2" style={dv}>
                    <h1 className="navbar-brand ms-4" style={wv}>Food Zoo</h1>
                    {currentUser?.role === 'user' ? (
            <button type="button" className="btn btn-primary" onClick={handleCartButtonClick} >
              Cart
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleModalOpen} >
              Add Food Item
            </button>
          )}

                </div>

            </nav>
            <div className="d-flex flex-wrap ">
                {foods.map(food => (
                    <FoodDetail key={food.id} food={food}  /> 
                ))}
            </div>
        
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Food Item </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <FormGroup className="mb-2" controlId="formFoodName">
                            <p><b>Food title</b></p>
                            <FormControl type="text" placeholder="Enter food name" name="name" value={newFood.name} onChange={handleInputChange} required/>
                        </FormGroup>

                        <FormGroup className="mb-2" controlId="formFoodDescription">
                            <p><b>Description</b></p>
                            <FormControl as="textarea" placeholder="Enter food description" name="description" value={newFood.description} onChange={handleInputChange} required/>
                        </FormGroup>

                        <FormGroup className="mb-2" controlId="formFoodPrice">
                            <p><b> Price</b></p>
                            <FormControl type="number" placeholder="Enter food price" name="price" value={isNaN(newFood.price) ? "" : newFood.price.toString()}
                                onChange={handleInputChange} required
                            />
                        </FormGroup>
                        <FormGroup className="mb-2" controlId="formFoodImage">
                            <p><b> Image </b></p>
                            <FormControl type="text" placeholder="Enter food image URL" name="image" value={newFood.image} onChange={handleInputChange} required/>
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
                <Cart/>
                </Modal.Body>
            </Modal>

        </>
    );
};

export default FoodList;
