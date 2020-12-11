const express = require('express');
const router = express.Router();

const file_upload_contoller = require('../controllers/fileupload.controller');

router.all('/upload', file_upload_contoller.index);
router.all('/status', file_upload_contoller.sendStatus);
router.all('/list', file_upload_contoller.list);

//Exporting The Router //
module.exports = router;