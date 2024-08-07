const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const codingController = require("../controllers/codingController");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();



const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "text/plain") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only TXT allowed!"), false);
    }
  },
});

router.get("/allproblems/:userid", codingController.allproblems_get);
router.get("/getproblem/:id", codingController.singleproblem_get);
router.get(
  "/usersubmissions/:questionid/:userid",
  codingController.user_submissions_get
);
router.post(
  "/addproblem",
  verifyToken,
  upload.fields([
    { name: "inputFile", maxCount: 1 },
    { name: "outputFile", maxCount: 1 },
  ]),
  codingController.addproblem_post
);
router.post(
  '/updateproblem/:id',
  verifyToken,
  upload.fields([
    { name: 'inputFile', maxCount: 1 },
    { name: 'outputFile', maxCount: 1 },
  ]),
  codingController.updateProblem_post
);

router.post("/runproblem", verifyToken, codingController.runproblem_post);
router.post("/submit", verifyToken, codingController.submit_post);
router.get("/getscores", codingController.get_scores);

module.exports = router;
