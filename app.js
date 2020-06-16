const express = require("express");
app = express();
bodyParser = require("body-parser");
mongoose = require("mongoose");
Trail = require("./models/trail");
Comment = require("./models/comment");
seedDB = require("./seeds");
passport = require("passport");
LocalStrategy = require("passport-local");
User = require("./models/user");
methodOverride = require("method-override");
flash = require("connect-flash");

//import in routes
const trailRoutes = require("./routes/trails");
commentRoutes = require("./routes/comments");
indexRoutes = require("./routes/index");

//mongoose setup, dynamically create
mongoose.connect("mongodb://localhost/trails_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB();

//passport config
//secret is used to sign the session ID cookie/compute the hash
app.use(
    require("express-session")({
        secret: "KS#K@(!3535A44EJFDJ",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//use routes
app.use("/trails", trailRoutes);
app.use("/trails/:id/comments", commentRoutes);
app.use("/", indexRoutes);

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});
