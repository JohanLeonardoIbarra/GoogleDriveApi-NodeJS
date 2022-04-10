const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const imagesController = require('../../controller/images/images');

router.post("/post", upload.single("image"), imagesController);

module.exports = router;