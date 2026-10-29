import {
  getUserID,
  getUserDetailsByID,
  getTotalAccountCount,
  authSignUp,
  authSignIn,
  cookieValidation,
  getUserDetails,
  updateUserDetails,
  getAllUsers,
  getUserCommentDetails,
  getUserModuleCommentDetails
} from '../models/accountModel'
import express from 'express'
const router = express.Router()

router.post('/signUp', (req: any, res: any) => {
  authSignUp(res, req)
})

router.post('/signIn', (req: any, res: any) => {
  authSignIn(res, req)
})

router.post('/cookieValidation', (req: any, res: any) => {
  cookieValidation(res, req)
})

router.get('/getUserDetails', (req: any, res: any) => {
  getUserDetails(res, req)
})

router.post('/updateUserDetails', (req: any, res: any) => {
  updateUserDetails(res, req)
})

router.get('/getAllUsers', (req: any, res: any) => {
  getAllUsers(res, req)
})

router.get('/getUserCommentDetails/:id', (req: any, res: any) => {
  getUserCommentDetails(res, req)
})

router.get('/getUserModuleCommentDetails/:id', (req: any, res: any) => {
  getUserModuleCommentDetails(res, req)
})

router.get('/getTotalAccountCount', (req: any, res: any) => {
  getTotalAccountCount(res, req)
})

router.get('/getUserDetailsByID/:id', (req: any, res: any) => {
  getUserDetailsByID(res, req)
})

router.get('/getUserID', (req: any, res: any) => {
  getUserID(res, req)
})

export default router
