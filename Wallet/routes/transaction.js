const express = require("express");
const router = express.Router();
const opt_check = require("../middleware/otp-check");

const transaction = require("../service/transaction");

router.post("/dotori-check", transaction.dustin_check);

router.post("/dustin-withrawal", opt_check, transaction.dustin_withrawal);

router.post("/dustin-deposit", transaction.dustin_deposit);

router.get("/dustin-list/:id", transaction.dustin_list);

router.get("/crypto-depositlist/:id", transaction.crypto_deposit_list); // 이더스캔에 찌르는거

router.get("/crypto-deposit/:id", transaction.crypto_deposit_list_front);

router.post("/crypto-check", transaction.crypto_check);

router.post("/crypto-withdral", opt_check, transaction.crypto_withdral);

router.get("/crypto-withdral-list/:id", transaction.crypto_withdral_list_front);

router.get("/crypto-list/:id", transaction.crypto_list);

module.exports = router;
