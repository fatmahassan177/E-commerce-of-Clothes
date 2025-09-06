const express = require('express');
const router = express.Router();
const {AddQuestion,DeleteQuestion,UpdateQuestion,getAllFAQ} = require('../Controllers/FAQ.controller');
const {authenticate}=require('../Middlewares/auth.middleware')
const {authorize}=require('../Middlewares/role.middleware')

router.post('/',authenticate,authorize('admin'),AddQuestion);
router.put('/:id',authenticate,authorize('admin'),UpdateQuestion)
router.get('/',getAllFAQ);
router.delete('/:id', authenticate,authorize('admin'),DeleteQuestion);

module.exports = router;