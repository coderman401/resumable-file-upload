const express = require('express');
const router = express.Router();

const file_upload_controller = require('../controllers/fileupload.controller');

router.all('/upload', file_upload_controller.index);
router.all('/status', file_upload_controller.sendStatus);
router.all('/list', file_upload_controller.list);

//Exporting The Router //
module.exports = router;