import express from 'express'
import { getOtherUser, logIn, logOut, register } from '../controllers/user.controller.js'
import isAuthenticated from '../middleware/isAuthenticated.js'
const router=express.Router()
router.route('/register').post(register)
router.route('/login').post(logIn)
router.route('/logout').get(logOut)
router.route('/').get(isAuthenticated,getOtherUser)
export  default router