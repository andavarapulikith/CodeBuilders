const router=require('express').Router();
const authController=require('../controllers/authController');
const verifyToken=require('../middleware/auth');

router.post('/login', authController.login_post);
router.post('/signup', authController.signup_post);
router.get('/profile/:id', verifyToken, authController.profile_get);

module.exports=router;