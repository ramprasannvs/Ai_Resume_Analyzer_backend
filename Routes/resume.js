const express = require('express');
const ResumeController = require('../Controller/resume');
const router = express.Router();
const { upload } = require('../utils/multer');

router.post('/addResume', upload.single('resume'), ResumeController.addResume);
router.get('/get', ResumeController.getResumeForAdmin);
router.get('/get/:user', ResumeController.getAllResumesForUser);



module.exports = router;
