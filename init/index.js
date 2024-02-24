const mongoose = require("mongoose");
const initData = require("./data.js");

const Profile = require("../models/profiles.js");

main().then(() => {
    console.log("Connected to DB Successfully");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/dating');
}

const initDB = async () => {
    await Profile.deleteMany({});
    await Profile.insertMany(initData.data);
    console.log("Data was Initialised");
}

initDB(); 