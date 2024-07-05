const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const codingController = require("../controllers/codingController");
const multer = require("multer");
const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");
dotenv.config();




const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


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

router.get(
  "/allproblems/:userid",codingController.allproblems_get
);
router.get("/getproblem/:id", codingController.singleproblem_get);
router.get("/usersubmissions/:questionid/:userid", codingController.user_submissions_get);
router.post(
  "/addproblem",
  verifyToken,
  upload.fields([
    { name: "inputFile", maxCount: 1 },
    { name: "outputFile", maxCount: 1 },
  ]),
  codingController.addproblem_post
);
router.post("/runproblem", verifyToken, codingController.runproblem_post);
router.post("/submit", verifyToken, codingController.submit_post);
router.get("/getscores", codingController.get_scores);

module.exports = router;
