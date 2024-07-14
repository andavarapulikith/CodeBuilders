const router=require('express').Router();
const verifyToken=require('../middleware/auth');
const assignmentController=require("../controllers/assignmentController")
router.post("/create",verifyToken,assignmentController.CreateAssignment);
router.get("/allassignments",verifyToken,assignmentController.getAllAssignments)
router.get("/:id",verifyToken,assignmentController.getAssignmentById)

module.exports=router  