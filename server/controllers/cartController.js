const Cart = require("../models/Cart");

// User ID එක extract කරගන්නා helper function එකක් (Middleware වෙනස්කම් නිසා එන Issue fix කිරීමට)
const getUserId = (req) => {
  return req.userId || req.user?._id || req.user?.id || req.user;
};

exports.getCart = async (req, res) => {
  try {
    const userId = getUserId(req);
    let cart = await Cart.findOne({ user: userId }).populate("items.product").lean();

    if (!cart) {
      const newCart = await Cart.create({ user: userId, items: [] });
      cart = await Cart.findById(newCart._id).populate("items.product").lean();
    }

    res.json(cart);
  } catch (err) {
    console.error("Get Cart Error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.addItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Existing product match කරන්නේ string compare එකෙන්
    const existingIndex = cart.items.findIndex((item) => {
      const pId = item.product?._id ? item.product._id.toString() : item.product.toString();
      return pId === productId.toString();
    });

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();

    // Plain JavaScript Object එකක් විදිහට lean() කර යැවීම
    const updatedCart = await Cart.findById(cart._id).populate("items.product").lean();
    res.json(updatedCart);
  } catch (err) {
    console.error("Add Item Error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex((item) => {
      const pId = item.product?._id ? item.product._id.toString() : item.product.toString();
      return pId === productId.toString();
    });

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product").lean();
    res.json(updatedCart);
  } catch (err) {
    console.error("Update Item Error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => {
      const pId = item.product?._id ? item.product._id.toString() : item.product.toString();
      return pId !== productId.toString();
    });

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product").lean();
    res.json(updatedCart);
  } catch (err) {
    console.error("Remove Item Error:", err);
    res.status(500).json({ message: err.message });
  }
};