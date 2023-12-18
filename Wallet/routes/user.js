const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const users = require("../service/user");
// 푸쉬 테스트
router.get("/update", users.user_update);

router.post("/nickname-check", users.nickname_check);

router.post("/pwd-check", users.pwd_check);

router.post("/otp-check", users.otp_check);

router.post("/set-otp", users.set_otp);

router.post("/basicregister", users.registr);

router.post("/registermail", users.send_email);

router.post("/login", users.login);

router.get("/logout", auth, users.logout);

router.post("/changepw", users.change_pw);

router.post("/id-check", users.id_check);

router.post("/require", users.require);

router.put("/require/:id", users.require_modify);

router.delete("/require/:id", users.require_delete);

router.get("/require/:id", users.require_list);

// cy-more
router.post("/more-pwchange", users.more_pwdchange);

router.post("/more-otp-change", users.more_otpchange);

router.post("/more-phone-change", users.more_phonechange);

module.exports = router;
