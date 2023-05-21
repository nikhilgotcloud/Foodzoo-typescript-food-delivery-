const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const newSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
  },
  email:{
    type: String,
  }

});


const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collection',
   
  },
});


const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'collection',
   
  },
  foodId: {
    type: String,
  },
  name: {
    type: String,
    
  },
  price: {
    type: Number,
    
  },
  image: {
    type: String,
    
  },
  quantity: {
    type: Number,
    default: 1,
  }

})


const collection = mongoose.model("collection", newSchema);  // user
const food = mongoose.model('food', foodSchema);   //Food
const Cart = mongoose.model('Cart', cartSchema);   //cart

module.exports = { collection, food, Cart };

