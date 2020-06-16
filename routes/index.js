const express = require("express");
router = express.Router({ mergeParams: true });
passport = require("passport");
User = require("../models/user");
middleware = require("../middleware");

//Landing Page
router.get("/", function (req, res) {
    res.render("landing");
});

//authentication routes

router.get("/register", function (req, res) {
    res.render("register", { message: req.flash("message") });
});

router.post("/register", function (req, res) {
    const newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/trails");
        });
    });
});

router.get("/login", function (req, res) {
    res.render("login", { message: req.flash("message") });
});

router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/trails",
        failureRedirect: "/login",
        failureFlash: true,
    }),
    function (req, res) {}
);

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/trails");
});

module.exports = router;
