const {getAllMessage,DeleteContact,MarkAsseen,AddContact,getUnseenMessages}=require('../Controllers/Contact.controller')
const express =require('express')
const  router=express.Router()
const {authenticate}=require('../Middlewares/auth.middleware')
const {authorize}=require('../Middlewares/role.middleware')

router.post('/',AddContact)
router.delete('/:id',authenticate,authorize('admin'),DeleteContact)
router.get('/',authenticate,authorize('admin'),getAllMessage)
router.put('/:id',authenticate,authorize('admin'),MarkAsseen)
router.get('/unseen',authenticate,authorize('admin'),getUnseenMessages)

module.exports=router