const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc Login/Landing Page
// @route GET /
router.get('/', ensureGuest, (req, res, next) => {
    res.render('login', {
        layout: 'login'
    });
});


// @desc Dashboard Page
// @route GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res, next) => {
    try {
        const stories = await Story.find({ user: req.user.id})
            .lean()
        res.render('dashboard', {
            name: req.user.firstName,
            stories
        });
    } catch (error) {
        console.error(error)
        res.render('errors/500')
    } 
});

module.exports = router