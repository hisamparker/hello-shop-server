import express from 'express'
const router = express.Router()
import { verifyUser, admin } from '../middleware/auth.js'
import { authUser, getProfile, registerUser, updateProfile, getAllUsers } from '../controllers/userController.js'

router.route('/').post(registerUser).get( verifyUser, getAllUsers)
router.route('/login').post(authUser)
// verifyUser will run everytime we hit the route!
router.route('/profile').get( verifyUser, getProfile).put(verifyUser, updateProfile)

export default router