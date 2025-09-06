const express=require('express')
const router=express.Router()
const {getUsers,CreateUser}=require('../Controllers/User.controller')
const {authenticate}=require('../Middlewares/auth.middleware')
const {authorize}=require('../Middlewares/role.middleware')
const {login}=require('../Controllers/auth.controller')

router.get('/',authenticate,authorize('admin'),getUsers)
router.post('/',CreateUser('user'))
router.post('/login',login)
router.post('/admin',CreateUser('admin'))

module.exports=router