const express = require('express');
const router = express.Router();

router.use('/test', (req, res, next) => {
  return res.status(200).json({ success: true, message: 'Successful request!' });
});

module.exports = router;
