const express = require("express");
router = express.Router({ mergeParams: true });
Trail = require("../models/trail");
middleware = require("../middleware");

//RESTFUL routes checklist
// trails
// index - display list of all
// new - display form to create new
// create - add new to DB
// show - get info about one

//comments
// new - create new comment
// create - add a new comment to the database

//Display all trails page

router.get("/", function (req, res) {
    Trail.find({}, function (err, allTrails) {
        if (err) {
            console.log(err);
        } else {
            res.render("trails/index", {
                trails: allTrails,
            });
        }
    });
});

// Add new campground route and page, one post (to send) and one get (to display form)
router.post("/", middleware.isLoggedIn, function (req, res) {
    //get data from form and add to trails array
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username,
    };
    const newTrail = {
        name: name,
        image: image,
        description: description,
        author: author,
    };
    //Create a new campground and save it to DB
    Trail.create(newTrail, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to trails page
            res.redirect("/trails");
        }
    });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("trails/new");
});

// Show details for trail
router.get("/:id", function (req, res) {
    //find the right trail then populate with its comments
    Trail.findById(req.params.id)
        .populate("comments")
        .exec(function (err, foundTrail) {
            if (err) {
                console.log(err);
            } else {
                res.render("trails/show", { trail: foundTrail });
            }
        });
});

// edit route
router.get("/:id/edit", middleware.checkTrailOwnership, function (req, res) {
    Trail.findById(req.params.id, function (err, foundTrail) {
        res.render("trails/edit", { trail: foundTrail });
    });
});

// update route
router.put("/:id", middleware.checkTrailOwnership, function (req, res) {
    Trail.findByIdAndUpdate(req.params.id, req.body.trail, function (
        err,
        updatedTrail
    ) {
        if (err) {
            res.redirect("/trails");
        } else {
            //redirect somewhere(show page)
            res.redirect("/trails/" + req.params.id);
        }
    });
});

// delete route
router.delete("/:id", middleware.checkTrailOwnership, function (req, res) {
    Trail.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/trails");
        } else {
            res.redirect("/trails");
        }
    });
});

module.exports = router;
