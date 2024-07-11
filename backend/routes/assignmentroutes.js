const router=require('express').Router();
const verifyToken=require('../middleware/auth');
const assignmentController=require("../controllers/assignmentController")
router.post("/create",assignmentController.CreateAssignment);
router.get("/allassignments",assignmentController.getAllAssignments)
router.get("/:id",assignmentController.getAssignmentById)

module.exports=router