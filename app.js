const express = require("express");
const { collection, food, Cart } = require("./mongo");
const SECRET_KEY = process.env.SECRET_KEY;
const {authenticateToken, errorHandler, isAdmin}= require("./authMiddleware.js")
const dotenv = require("dotenv");
dotenv.config();
const PORT=process.env.PORT || 8000


const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const otpCache = new NodeCache();

// const authenticateToken = require('./authMiddleware');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", cors(), (req, res) => {

});


//send otp
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  
  // Generate a random OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  otpCache.set(email, otp.toString());

  // Configure the nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nikhilanand73@gmail.com',
      pass: 'fradsmbajjdvbywu',
    },
  });

  const mailOptions = {
    from: 'nikhilanand73@gmail.com',
    to: email,
    subject: 'FoodZoo - OTP Verification',
    text: `Your OTP is: ${otp}. Please enter your OTP to verify your email and create an account.`,
  };

  try {
    // Send the email with the OTP
    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }


});

//signup
app.post('/signup', async (req, res) => {
  const { username, password, role, email, otp } = req.body;

  try {
    const existingUser = await collection.findOne({ username });
    
    if (existingUser) {
      return res.status(400).json('Username already exists');
    }
    const existingEmail = await collection.findOne({ email });

    if (existingEmail) {
      return res.status(400).json('Email already exists');
    }

    const storedOTP = otpCache.get(email);
   

    if (otp !== storedOTP) {
      return res.status(400).json('Invalid OTP');
    }
    otpCache.del(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      password: hashedPassword,
      role,
      email,
    };

    await collection.insertMany([newUser]);

    const token = jwt.sign({ username }, SECRET_KEY);

    res.json({ username, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json('Failed to create user');
  }
});

//login
app.post("/", async (req, res) => {
  const { username, password,role } = req.body;
 
  try {
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(400).json("notexist");
    }


    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json("Invalid password");
    }
    const userRole = user.role;
    const userId = user._id;
   
    const token = jwt.sign({ username,userId }, SECRET_KEY);

    res.header('Authorization', `Bearer ${token}`);
    res.json({ username, token,role: userRole,userId  });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json("Login failed");
  }
});

// to get food item from db -> FOOD API
app.get("/food", authenticateToken, async (req, res,next) => {
  try {
    const { userId } = req.user;
    const role = req.user.role;

    let foodItems;
    if (role === "admin") {
      foodItems = await food.find({ userId }).exec();
    } else {
      foodItems = await food.find().exec();
    }

    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
   next({statusCode:500, message: "cannot get food item"});
  }
});

// Add food item to Food API
app.post("/foods", authenticateToken, isAdmin, async (req, res,next) => {
  const { name, description, price, image } = req.body;

  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Invalid or missing user ID" });
    }

    const newFood = {
      name,
      description,
      price,
      image,
      userId,
    };

    // Insert the new food item into the database
    const addedFood = await food.create(newFood);

    res.json({ success: true, message: "Food item added successfully", food: addedFood });
  } catch (error) {
    console.error("Error adding food item:", error);
    next({statusCode:500, message: "failed to add food item"});
  }
});

// edit food
app.put("/foods/:id", authenticateToken, async (req, res,next) => {
  try {
  
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const updatedFood = await food.findByIdAndUpdate(
      id,
      { name, description, price, image },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    res.status(200)
      .json({ success: true, food: updatedFood, message: "Food updated successfully" });
  } catch (error) {
    console.error("Error updating food item:", error);
    next({statusCode:500, message: "failed to update food item"});
  }
});



//delete food item 
app.delete("/foods/:foodId", authenticateToken, async (req, res,next) => {
  try {
    const { foodId } = req.params;
    const deletedFood = await food.findByIdAndDelete(foodId);

    if (!deletedFood) {
      return res.status(404).json({ error: "Food item not found" });
    }

    res.status(200).json({ success: true, food: deletedFood, message: "Food deleted successfully" });
  } catch (error) {
    console.error("Error deleting food item:", error);
    next({statusCode:500, message: "error deleting food item"});
  }
});


// for getting food item to cart 
app.get('/food/:foodId', authenticateToken, async (req, res, next) => {
  const { foodId } = req.params;
 

  try {
    const foodItem = await food.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(foodItem);
  } catch (error) {
    console.error('Error fetching food:', error);
    next({statusCode:500, message: "failed to fetch food"});
  }
});


// fetching food item to cart
app.get('/cart', authenticateToken, async (req, res,next) => {
  try {
    const { userId } = req.user;
    const cartItems = await Cart.find({ userId });

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    next({statusCode:500, message: "failed to fetch cart item"});
  }
});

// adding item to cart
// app.post('/cart', async (req, res) => {
//   const { currentFood } = req.body;

//   try {
//     const newCartItem = new Cart(currentFood);
//     await newCartItem.save();

//     res.json({ success: true, message: 'Food item added to cart' });
//   } catch (error) {
//     console.error('Error adding item:', error);
//     res.status(500).json({ success: false, error: 'Failed to add item to cart' });
//   }
// });
app.post("/cart", authenticateToken, async (req, res,next) => {
  const { currentFood } = req.body;
  const { userId } = req.user;

  try {
    const existingCartItem = await Cart.findOne({ foodId: currentFood.foodId, userId });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      const newCartItem = new Cart({ ...currentFood, userId });
      await newCartItem.save();
    }

    res.json({ success: true, message: "Food item added to cart" });
  } catch (error) {
    console.error("Error adding item:", error);
    next({statusCode:500, message: "failed to add item to cart"});
  }
});


//delete item from cart
app.delete("/cart/:foodId", authenticateToken, (req, res, next) => {
  const foodId = req.params.foodId;
  const userId = req.user.userId;

  Cart.findOneAndDelete({ _id: foodId, userId })
    .then((deletedFoodItem) => {
      if (!deletedFoodItem) {
        res.status(404).json({ error: "Food item not found in cart." });
      } else {
        res.status(200).json(deletedFoodItem);
      }
    })
    .catch((error) => {
      console.error("Error deleting food item from cart:", error);
      next(error);
    });
});


//increase quantity
app.put('/cart/:foodId/increase', async (req, res) => {
  const { foodId } = req.params;
  try { 
    
    const cartItem = await Cart.findOne({ _id: foodId});
    // console.log(cartItem,foodId)
   
    if (cartItem) {
      
      cartItem.quantity += 1;
      await cartItem.save();
      res.json({ success: true, message: 'Cart item quantity increased' });
    } else {
      res.status(404).json({ success: false, message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error increasing cart item quantity:', error);
    res.status(500).json({ success: false, error: 'Failed to increase cart item quantity' });
  }
});

// decrease quantity
app.put('/cart/:foodId/decrease',async (req, res) => {
  const { foodId } = req.params;

  try {
  
    const cartItem = await Cart.findOne({ _id:foodId });

    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
        res.json({ success: true, message: 'Cart item quantity decreased' });
      } else {
        await cartItem.remove();
        res.json({ success: true, message: 'Cart item removed' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error decreasing cart item quantity:', error);
    res.status(500).json({ success: false, error: 'Failed to decrease cart item quantity' });
  }
});
// update cart item quantity
app.put('/cart/:foodId', async (req, res,next) => {
  const { foodId } = req.params;
  const { quantity } = req.body;

  try {
    
    const cartItem = await Cart.findOne({ foodId });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      res.json({ success: true, message: 'Cart item quantity updated' });
    } else {
      res.status(404).json({ success: false, message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    next({statusCode:500, message: "failed to update cart item quantity"});
  }
});

app.use(errorHandler);
// app.get('/users/:username', async (req, res) => {
//     const { username } = req.params;

//     try {
//       const user = await collection.findOne({ username }).exec();

//       if (user) {
//         res.json({ role: user.role });
//       } else {
//         res.sendStatus(404);
//       }
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       res.sendStatus(500);
//     }
//   });

app.listen( PORT, () => {
  console.log("Server running on port " + PORT);
});
