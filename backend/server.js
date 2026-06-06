require("dotenv").config();
const express = require('express');
const cors = require('cors');
const userRoute = require("./routes/userRoute");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

require("./config/db");
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/messages", messageRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});