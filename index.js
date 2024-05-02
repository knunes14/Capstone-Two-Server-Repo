const express = require("express");
const cors = require('cors'); 
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const wetsuitsRoute = require("./routes/wetsuits");

app.use(cors()); // This will enable all CORS requests.
app.use(express.json());  // Parse application/json

// DB connection
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DB Connection Successful!"))
    .catch((err) => {
        console.log(err)
    });

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

    app.use(express.json());
    app.use("/server/auth", authRoute);
    app.use("/server/users", userRoute);
    app.use("/server/products", productRoute);
    app.use("/server/carts", cartRoute);
    app.use("/server/orders", orderRoute);
    app.use("/server/checkout", stripeRoute);
    app.use("/server/wetsuits", wetsuitsRoute);

// Error handling for unmatched routes
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

// Global error handling middleware
app.use((error, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('Error:', error);  // Log error stack to console
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000")
});

