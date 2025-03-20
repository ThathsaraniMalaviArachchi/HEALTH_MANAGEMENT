const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const healthLogController = require('../controllers/healthLogController');

router.post('/', auth, healthLogController.create);
router.get('/', auth, healthLogController.getAll);
router.put('/:id', auth, healthLogController.update);
router.delete('/:id', auth, healthLogController.delete);

module.exports = router;
