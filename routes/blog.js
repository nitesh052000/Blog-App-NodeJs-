const express = require("express");
const { User } = require("../model/user");

const router = express.Router();

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    User: req.user,
  });
});

router.post("/", (req, res) => {
  return res.redirect("/");
});

module.exports = router;
