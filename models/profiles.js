const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    ids: {
        type: String,
        set: (v) => v ==="" ? "https://www.instagram.com/ig_rupesh30/" : v,
    }
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;