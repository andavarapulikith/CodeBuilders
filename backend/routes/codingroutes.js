const router=require('express').Router();
const verifyToken=require('../middleware/auth');
const codingController=require('../controllers/codingController');

router.get('/allproblems',verifyToken, codingController.allproblems_get);

router.get('/allproblems/:id', codingController.singleproblem_get);

router.post('/addproblem',verifyToken, codingController.addproblem_post);


module.exports=router
