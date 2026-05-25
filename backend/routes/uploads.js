const express = require("express");
const multer = require("multer");
const db = require("../config/db");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

router.post("/", upload.single("certificate"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    db.query(
        "INSERT INTO uploads (filename, filepath) VALUES (?, ?)",
        [req.file.filename, req.file.path],
        (err) => {
            if (err) return res.status(500).json({ message: "Database upload failed" });

            res.json({ message: "Certificate uploaded successfully" });
        }
    );
});

module.exports = router;