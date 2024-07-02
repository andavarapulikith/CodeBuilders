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

// const s3Client = new S3Client({
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   }
// });

// // Function to get signed URL for S3 object
// async function getObjectURL(key) {
//   const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: key });
//   const url = await getSignedUrl(s3Client, command);
//   return url;
// }

// // Function to get signed URL for S3 object upload
// async function putObject(filename) {
//   const command = new PutObjectCommand({
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/user-uploads/${filename}`,
//     ContentType: "text/plain"
//   });
//   const url = await getSignedUrl(s3Client, command, { expiresIn: 36000 });
//   return url;
// }

// // Define storage for files using multer-s3
// const storage = multerS3({
//   s3: s3Client,
//   bucket: process.env.AWS_BUCKET_NAME,
//   key: function (req, file, cb) {
//     cb(null, `uploads/user-uploads/${Date.now()}_${file.originalname}`);
//   }
// });

// // Initialize multer instance
// const upload = multer({ storage: storage, fileFilter: function (req, file, cb) {
//   if (file.mimetype === 'text/plain') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type, only TXT allowed!'), false);
//   }
// }});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Define storage for files using multer memory storage
const storage = multer.memoryStorage();

// Initialize multer instance
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
  "/allproblems/:userid",
  verifyToken,
  codingController.allproblems_get
);
router.get("/getproblem/:id", codingController.singleproblem_get);
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
