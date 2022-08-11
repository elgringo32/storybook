const express = require('express')
const router = express.Router()
const passport = require('passport')

// @desc Auth via Google
// @route GET /
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
  );

// @desc Google auth callback 
// @route GET /dashboard  
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  }
);

// @desc Logout from app
// @route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    })
    res.redirect('/')
})

module.exports = router