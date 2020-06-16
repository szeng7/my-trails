const mongoose = require("mongoose");

//create a schema. comments is an array of comment ID references
const trailSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        username: String,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

//initialize a singular of the item to be stored, compile schema into model
//export it out so that we can import it in in app.js
module.exports = mongoose.model("Trail", trailSchema);
