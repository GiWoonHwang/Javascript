const express     = require('express');
const router      = express.Router();
const opt_check   = require('../middleware/otp-check')
const swap        = require('../controllers/swap')

router.post('/check',swap.check )

router.post('/', opt_check, swap.swap);

router.get('/:id', swap.list);

module.exports = router;