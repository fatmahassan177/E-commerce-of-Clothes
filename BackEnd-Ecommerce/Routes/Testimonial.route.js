const express =require('express')
const  router=express.Router()
const {authenticate}=require('../Middlewares/auth.middleware')
const {authorize}=require('../Middlewares/role.middleware')
const {getApprovedTestimonials,getUnseenTestimonials,GetAllTestimonial,DeleteTestimonial,ApproveTestimonial,MarkTestimonialAsSeen, getUnapprovedTestimonials,AddTestimonials,getSeenTestimonials}=require('../Controllers/Testimonials.controller')

router.get('/approved',getApprovedTestimonials)
router.get('/unseen',authenticate,authorize('admin'),getUnseenTestimonials)
router.get('/seen',authenticate,authorize('admin'),getSeenTestimonials)
router.get('/',authenticate,authorize('admin'),GetAllTestimonial)
router.get('/unapproved',authenticate,authorize('admin'),getUnapprovedTestimonials)
router.put('/approve/:id',authenticate,authorize('admin'),ApproveTestimonial)
router.post('/',authenticate,authorize('user'),AddTestimonials)
router.put('/seen/:id',authenticate,authorize('admin'),MarkTestimonialAsSeen)
router.delete('/:id',authenticate,authorize('admin'),DeleteTestimonial)

module.exports=router