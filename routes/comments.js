const express = require("express");
router = express.Router({ mergeParams: true });
Trail = require("../models/trail");
Comment = require("../models/comment");
middleware = require("../middleware");

//comments routes

router.get("/new", middleware.isLoggedIn, function (req, res) {
    Trail.findById(req.params.id, function (err, trail) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { trail: trail });
        }
    });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
    Trail.findById(req.params.id, function (err, trail) {
        if (err) {
            console.log(err);
            res.redirect("/trails");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    trail.comments.push(comment);
                    trail.save();
                    res.redirect("/trails/" + trail._id);
                }
            });
        }
    });
});

//edit comment

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (
    req,
    res
) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {
                trail_id: req.params.id,
                comment: foundComment,
            });
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function (
    req,
    res
) {
    Comment.findByIdAndUpdate(
        req.params.comment_id,
        req.body.comment,
        function (err, updatedComment) {
            if (err) {
                res.redirect("back");
            } else {
                res.redirect("/trails/" + req.params.id);
            }
        }
    );
});

//delete comment

router.delete("/:comment_id", middleware.checkCommentOwnership, function (
    req,
    res
) {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/trails/" + req.params.id);
        }
    });
});

module.exports = router;
