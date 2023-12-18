const express     = require('express');
const router      = express.Router();
const opt_check   = require('../middleware/otp-check');
const store       = require('../controllers/store');

router.post('/check',store.check )

router.post('/purchase-or-gift', opt_check, store.purchase_or_gift);
// router.post("/purchase-or-gift", store.purchase_or_gift);


// http://localhost:8588/store/list?id=root@root.com&type=purchase
router.get('/list', store.list );


module.exports = router;