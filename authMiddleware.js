const jwt = require("jsonwebtoken");
const { collection } = require("./mongo");
const SECRET_KEY = "NOTESAPI";
// const {Cart}= require("./mongo")


const authenticateToken = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    if (!decodedToken || !decodedToken.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};


const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({ error: message })};


const isAdmin = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await collection.findOne({ _id: userId });

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // Middleware to check if the user is authorized to modify the cart item
// const isAuthorizedToModifyCart = async (req, res, next) => {
//   try {
//     const { foodId } = req.params;
//     const { userId } = req.user;

//     const cartItem = await Cart.findOne({ _id: foodId });

//     if (!cartItem || cartItem.userId !== userId) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     req.cartItem = cartItem;
//     next();
//   } catch (error) {
//     console.error('Error checking cart item authorization:', error);
//     res.status(500).json({ success: false, error: 'Failed to check cart item authorization' });
//   }
// };


module.exports = {authenticateToken,errorHandler,isAdmin,};
