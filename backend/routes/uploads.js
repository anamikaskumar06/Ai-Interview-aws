









const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const db = require("../config/db");

const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "private",
        key: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })
});

router.post("/", upload.single("certificate"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    db.query(
        "INSERT INTO uploads (filename, filepath) VALUES (?, ?)",
        [req.file.key, req.file.location],
        (err) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Database upload failed"
                });
            }

            res.json({
                message: "Certificate uploaded successfully",
                fileUrl: req.file.location
            });

        }
    );

});

module.exports = router;



