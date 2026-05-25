const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* =========================
   GET DASHBOARD STATS
========================= */

router.get("/stats", (req, res) => {

    const stats = {};

    db.query(
        "SELECT COUNT(*) AS totalUsers FROM users",
        (err, users) => {

            if (err) {
                return res.status(500).json({
                    message: "Error loading users"
                });
            }

            stats.totalUsers = users[0].totalUsers;

            db.query(
                "SELECT COUNT(*) AS totalUploads FROM uploads",
                (err, uploads) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Error loading uploads"
                        });
                    }

                    stats.totalUploads = uploads[0].totalUploads;

                    db.query(
                        "SELECT COUNT(*) AS totalAdmins FROM users WHERE role='admin'",
                        (err, admins) => {

                            if (err) {
                                return res.status(500).json({
                                    message: "Error loading admins"
                                });
                            }

                            stats.totalAdmins = admins[0].totalAdmins;

                            res.json(stats);
                        }
                    );
                }
            );
        }
    );
});

/* =========================
   GET ALL USERS
========================= */

router.get("/users", (req, res) => {

    db.query(
        "SELECT id, name, email, role FROM users",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error loading users"
                });
            }

            res.json(result);
        }
    );
});

/* =========================
   UPDATE USER
========================= */

router.put("/users/:id", (req, res) => {

    const { name, email, role } = req.body;

    const { id } = req.params;

    db.query(
        "UPDATE users SET name=?, email=?, role=? WHERE id=?",
        [name, email, role, id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Update failed"
                });
            }

            res.json({
                message: "User updated successfully"
            });
        }
    );
});

/* =========================
   DELETE USER
========================= */

router.delete("/users/:id", (req, res) => {

    const { id } = req.params;

    db.query(
        "DELETE FROM users WHERE id=?",
        [id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    message: "Delete failed"
                });
            }

            res.json({
                message: "User deleted successfully"
            });
        }
    );
});

/* =========================
   GET ALL UPLOADS
========================= */

router.get("/uploads", (req, res) => {

    db.query(
        "SELECT * FROM uploads ORDER BY uploaded_at DESC",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Error loading uploads"
                });
            }

            res.json(result);
        }
    );
});

module.exports = router;