const express = require('express');
const imagesRoutes = require("./src/routes/images/images");
const cors = require("cors");

const app = express();
//Settings
app.set("port", process.env.PORT || 3000);
//Middlewares
app.use(express.json());
app.use(cors());
//Routes
app.use("/api/images", imagesRoutes);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
});