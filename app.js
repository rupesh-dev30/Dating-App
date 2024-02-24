const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { body, validationResult } = require('express-validator');
const path = require('path');
const Profile = require('./models/profiles.js');

const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Database connection
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/dating');
    console.log('Connected to DB Successfully');
}

main().catch(err => console.error(err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello Everyone');
});

app.get('/profiles', async (req, res) => {
    const allProfiles = await Profile.find({});
    res.render('./profiles/index.ejs', { allProfiles });
});

app.get('/profiles/new', (req, res) => {
    res.render('./profiles/new.ejs');
});

app.post('/profiles', [
    body('profile.username').notEmpty(),
    body('profile.password').isLength({ min: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const profile = new Profile(req.body.profile);
    await profile.save();
    res.redirect('/profiles');
});

app.get('/profiles/:id/edit', async (req, res) => {
    let { id } = req.params;
    const profile = await Profile.findById(id);
    res.render('./profiles/edit.ejs', { profile });
});

app.put('/profiles/:id', async (req, res) => {
    let { id } = req.params;
    await Profile.findByIdAndUpdate(id, { ...req.body.profile });
    res.redirect('/profiles');
});

app.post('/profiles/:id/matching', async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).send('Profile not found');
        }

        const matchingProfile = await Profile.findOne({ username: profile.ids, ids: profile.username });

        if (!matchingProfile) {
            return res.status(200).send('No mutual matching profiles found');
        }

        res.render('./profiles/matching.ejs', { mutualMatchingProfile: matchingProfile });
    } catch (error) {
        console.error('Error occurred while finding matching profile:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/profiles/:id', async (req, res) => {
    let { id } = req.params;
    const profile = await Profile.findById(id);
    res.render('./profiles/show.ejs', { profile });
});

// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
