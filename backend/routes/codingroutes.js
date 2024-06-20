const router=require('express').Router();
const verifyToken=require('../middleware/auth');
const codingController=require('../controllers/codingController');

router.get('/allproblems/:userid',verifyToken, codingController.allproblems_get);

router.get('/getproblem/:id', codingController.singleproblem_get);

router.post('/addproblem',verifyToken, codingController.addproblem_post);

router.post("/runproblem",verifyToken,codingController.runproblem_post);

router.post("/submit",verifyToken,codingController.submit_post)


module.exports=router
