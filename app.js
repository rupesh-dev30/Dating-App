const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Profile = require("./models/profiles.js")
const path = require("path")
const methodOverride = require("method-override")

main().then(() => {
    console.log("Connected to DB Successfully");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/dating');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
    res.send("Hello Everyone")
})

app.get("/profiles", async (req, res) => {
    const allProfiles = await Profile.find({});
    res.render("./profiles/index.ejs", { allProfiles })
})

app.get("/profiles/new", (req, res) => {
    res.render("./profiles/new.ejs");
})

app.post("/profiles", async (req, res) => {
    const profile = new Profile(req.body.profile);
    await profile.save();
    res.redirect("/profiles");
})

app.get("/profiles/:id/edit", async (req, res) => {
    let { id } = req.params;
    const profile = await Profile.findById(id);
    res.render("./profiles/edit.ejs", { profile })
})

app.put("/profiles/:id", async (req, res) => {
    let { id } = req.params;
    await Profile.findByIdAndUpdate(id, { ...req.body.profile });
    res.redirect("/profiles");
})

app.post("/profiles/:id/matching", async (req, res) => {
    try {
        const { id } = req.params;

        // Find the profile by its ID
        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).send("Profile not found");
        }

        // Find the profile with matching ids
        const matchingProfile = await Profile.findOne({ username: profile.ids, ids: profile.username });

        // Check if mutual matching profile exists
        if (!matchingProfile) {
            return res.status(200).send("No mutual matching profiles found");
        }

        // Render the matching.ejs template and pass the matching profile to it
        res.render("./profiles/matching.ejs", { mutualMatchingProfile: matchingProfile });
    } catch (error) {
        console.error("Error occurred while finding matching profile:", error);
        res.status(500).send("Internal Server Error");
    }
});




app.get("/profiles/:id", async (req, res) => {
    let { id } = req.params;
    const profile = await Profile.findById(id);
    res.render("./profiles/show.ejs", { profile })
})

// app.get("/testProfile", async (req, res) => {
//     let sampleProfile = new Profile({
//         username: "bittu_12_14",
//         password: "bittu",
//         name: "Bittu Kumar",
//         ids: "https://www.instagram.com/ig_rupesh30/"
//     });

//     await sampleProfile.save();
//     console.log("sample was saved");
//     res.send("Successfull Testing");
// })

app.listen(3000, () => {
    console.log("Server is listening to port 3000");
}) 