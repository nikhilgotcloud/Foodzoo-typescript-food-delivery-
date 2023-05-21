import React,{useState} from 'react';
// import { FoodsContext } from '../context/FoodContext';
import axios from 'axios';
import { Food } from '../models/Foodmodel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form, FormGroup, FormControl } from 'react-bootstrap';


interface Props {
  food: Food;
  handleDelete: (foodId: string) => Promise<void>;
  handleUpdate: (updatedFood: Food) => void;
}

// interface User {
//     username: string;
//     password: string;
//     role: string;
//   }

const FoodDetail: React.FC<Props> = ({ food, handleDelete, handleUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedFood, setEditedFood] = useState<Food>({
    _id: food._id,
    name: food.name,
    description: food.description,
    price: food.price,
    image: food.image,
  });
  const handleEditClick = async () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:8000/foods/${food._id}`,
        {
          name: editedFood.name,
          description: editedFood.description,
          price: editedFood.price,
          image: editedFood.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedFood = response.data.food;
        setEditedFood(updatedFood);
        handleUpdate(updatedFood);

        toast.success(response.data.message, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      } else {
        console.error('Failed to update food item:', response.data.error);
        toast.error('Failed to update food item', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        });
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      toast.error('Failed to update food item', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
      });
    }

    handleCloseModal();
  };

  const handleDeleteClick = async (foodId: string) => {
    try {
      await handleDelete(foodId);
    } catch (error) {
      console.error('Error deleting food item:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const currentFood = {
        foodId: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
      };
      const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.post('http://localhost:8000/cart', { currentFood }, config);
      console.log('Added to cart:', currentFood);
      toast.success('Item added to cart!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  const role = localStorage.getItem('role');

  // const { addToCart } = useContext(FoodsContext);
  // function handleAddToCart() {
  // addToCart(food);
  // } 
  // const [currentUser, setCurrentUser] = useState<User | null>(null);

  // useEffect(() => {
  //   const currentUserData = localStorage.getItem('currentUser');
  //   if (currentUserData) {
  //     const user: User = JSON.parse(currentUserData);
  //     setCurrentUser(user);
  //   }
  // }, []);
  return (
    <>
      <div className="card ms-4 mb-4 mt-3 me-4" style={{ width: '15rem' }} >
        <img className="card-img-top" src={food.image} alt={food.name} width={50} height={150} />
        <div className="card-body">
          <h4>{food.name}</h4>
          <p>{food.description}</p>
          <p>Price: <b>₹</b> {food.price}</p>
          {role === 'user' && (
            <button type="button" className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
          )}
          {role === 'admin' && (
            <div className="text-end">
              <button type="submit" className="btn btn-warning" onClick={handleEditClick} >
                Edit
              </button>
              <button type="submit" className="btn btn-primary ms-2" onClick={() => handleDeleteClick(food._id)} >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form method="POST" onSubmit={handleEditSubmit}>
            <FormGroup className="mb-2" controlId="formFoodName">
              <p>
                <b>Food title</b>
              </p>
              <FormControl
                type="text"
                placeholder="Enter food name"
                name="name"
                value={editedFood.name}
                  onChange={(e) =>
                    setEditedFood({ ...editedFood, name: e.target.value })
                  }
               
              />
            </FormGroup>

            <FormGroup className="mb-2" controlId="formFoodDescription">
              <p>
                <b>Description</b>
              </p>
              <FormControl
                as="textarea"
                placeholder="Enter food description"
                name="description"
                value={editedFood.description}
                  onChange={(e) =>
                    setEditedFood({ ...editedFood, description: e.target.value })
                  }
                
              />
            </FormGroup>

            <FormGroup className="mb-2" controlId="formFoodPrice">
              <p>
                <b>Price</b>
              </p>
              <FormControl
                type="number"
                placeholder="Enter food name"
                name="name"
                value={editedFood.price}
                  onChange={(e) =>
                    setEditedFood({ ...editedFood, price: parseFloat(e.target.value) })
                  }
              />
            
            </FormGroup>
            <FormGroup className="mb-2" controlId="formFoodImage">
              <p>
                <b>Image</b>
              </p>
              <FormControl
                type="text"
                placeholder="Enter food image URL"
                name="image"
                value={editedFood.image}
                  onChange={(e) =>
                    setEditedFood({ ...editedFood, image: e.target.value })
                  }
                
              />
            </FormGroup>
            <Button className='mt-2' type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>

    </>
  );
};

export default FoodDetail;
