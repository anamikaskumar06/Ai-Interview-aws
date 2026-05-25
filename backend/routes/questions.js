const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* ADD QUESTION */
router.post("/", (req, res) => {
  const { title, category, difficulty } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Question title is required"
    });
  }

  const sql =
    "INSERT INTO questions (title, category, difficulty) VALUES (?, ?, ?)";

  db.query(sql, [title, category, difficulty], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to add question"
      });
    }

    res.json({
      message: "Question added successfully"
    });
  });
});

/* GET ALL QUESTIONS */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM questions ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(result);
  });
});

/* DELETE QUESTION */
router.delete("/:id", (req, res) => {
  const sql = "DELETE FROM questions WHERE id = ?";

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to delete question"
      });
    }

    res.json({
      message: "Question deleted successfully"
    });
  });
});

module.exports = router;