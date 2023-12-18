const express = require("express");
const router = express.Router();
const erc = require("../service/erc");

router.post("/createwallet", erc.create_wallet);
router.get("/collect/:id", erc.collect);

module.exports = router;
