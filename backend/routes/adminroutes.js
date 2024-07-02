const router=require("express").Router();
const adminController=require("../controllers/adminController");

router.get("/",adminController.get_admin_data)
router.get("/submissions",adminController.get_submissions_data)
router.get("/users",adminController.get_users_data)
router.get("/questions",adminController.get_problems_data)
router.delete("/questions/:id",adminController.delete_question)
module.exports=router;

