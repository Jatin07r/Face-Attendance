const express = require('express');
const router = express.Router();

router.get("/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Logout failed");
      }
      res.clearCookie("connect.sid");
      res.status(200).send("Logged out successfully");
    });
});
  
module.exports = router;