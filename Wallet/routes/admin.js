const express = require("express");
const router = express.Router();
const admin = require("../service/admin");
const auth = require("../middleware/auth-check");
const check = require("../middleware/auth-check copy");

// 어드민에 미들웨어 적용해야함

router.post("/login", admin.login); // 로그인

router.post("/admin-login", admin.admin_login); // 어드민 로그인

// user
router.post("/otp", auth.user_read_auth, admin.otp_reset); // otp 초기화
router.post("/pwd", auth.user_read_auth, admin.pwd_reset); // 비밀번호 초기화
router.post("/status", auth.user_read_auth, admin.user_status); // 유저 상태값 변경
router.get("/user", admin.user_data); // 유저 리스트

// notice
router.post("/notice", auth.notice_read_auth, admin.notice); // 공지 작성
router.delete("/notice/:id", auth.notice_read_auth, admin.notice_delete); // 공지 삭제
router.get("/notice", admin.notice_list); // 공지 리스트 불러오기

// property
router.get("/property", admin.property_list); // 자산 리스트
router.get("/user-property/:id", admin.user_property_list); // 유저 자산 리스트?
router.get("/transaction", admin.transaction_list); // 유저 거래 리스트

// event
router.post("/event", admin.event); // 이벤트 등록
router.delete("/event/:id", admin.event_delete); // 이벤트 삭제
router.get("/event", admin.event_list); // 이벤트 리스트 불러오기

// cs
router.put("/require-answer/:id", admin.require_answer); // 문의에 답변
router.get("/require-list", admin.require_list); // 문의 리스트

// store
router.post("/store-register", auth.super_read_auth, admin.store_register); // 스토어 등록
router.delete("/furniture/:id", auth.super_read_auth, admin.furniture_delete); // 미니미 삭제
router.delete("/myroom/:id", auth.super_read_auth, admin.myroom_delete); // 미니룸 삭제

router.get("/furniture", admin.furniture_list); // 미니미 등록 리스트
router.get("/myroom", admin.myroom_list); // 미니룸 등록 리스트
router.get("/purchase-list", admin.store_business_list); // 구매 및 선물 리스트

// 지급
router.post("/payment-regist", auth.payment_read_auth, admin.payment_regist); // 지급 리스트 작성하기
router.post("/payment", auth.payment_read_auth, admin.payment); // 지급 하기
router.post("/retrieve-regist", auth.payment_read_auth, admin.retrieve_regist); // 회수 리스트 작성
router.post("/retrieve", auth.payment_read_auth, admin.retrieve); // 회수 하기

router.get("/payment-list", admin.payment_list); // 지급 db 리스트 불러오기
router.get("/email-list", admin.email_list); // 지급 및 회수할때 이메일 불러오기
router.get("/retrieve-list", admin.retrieve_list); // 회수 db 리스트 불러오기

// 계정관리
router.post("/auth-regist", auth.super_read_auth, admin.auth_regist); // 권한 등록하기
router.post("/register", auth.super_read_auth, admin.register); // 어드민 유저 등록하기

router.get("/auth-list", admin.auth_list); // 권한 리스트
router.get("/admin-list", admin.admin_list); // 어드민 유저 리스트
router.get("/admin-info/:id", admin.admin_info); // 어드민 상세 내역

router.get("/user-auth", admin.user_auth); // 유저 페이지 볼 수 있는 권한 유무
router.get("/notice-auth", admin.notice_auth); // 공지 페이지 볼 수 있는 권한 유무
router.get("/asset-auth", admin.asset_auth); // 자산 페이지 볼 수 있는 권한 유무
router.get("/payment-auth", admin.payment_auth); // 지급 페이지 볼 수 있는 권한 유무
router.get("/cs-auth", admin.cs_auth); // cs 페이지 볼 수 있는 권한 유무
router.get("/event-auth", admin.event_auth); // 이벤트 페이지 볼 수 있는 권한 유무

router.get("/store-auth", admin.store_auth); // 스토어 페이지 볼 수 있는 권한 유무

module.exports = router;
