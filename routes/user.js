const express = require("express");

const router = express.Router();

const { User } = require("../model/user");

router.get("/signin", (req, res) => {
  return res.render("sighin");
});

router.get("/sighup", (req, res) => {
  return res.render("sighup");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("token", token);
    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("sighin", {
      error: "Incorrect Email or Password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/sighup", async (req, res) => {
  const { fullname, email, password } = req.body;

  await User.create({
    fullName: fullname,
    email: email,
    password: password,
  });

  return res.redirect("/");
});

module.exports = router;
