require("dotenv").config();
const userRoutes = require("./controllers/routes/userRoutes");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const loggerMiddleware = require("./middleware/loggerMiddleware")
const errorMiddleware = require("./middleware/errorMiddleware")

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected!");
})
.catch((error) => {
    console.log(error);
})

app.use(express.json());
app.use(loggerMiddleware);

// test
app.get("/test", async (req, res) => {
    const usersFromDB = await User.find();
    res.json(usersFromDB);
})

// login
app.use("/api/users", userRoutes);
app.use(errorMiddleware);

// web 3000
app.listen(3000, () => {
    console.log("Server running on port 3000");
});