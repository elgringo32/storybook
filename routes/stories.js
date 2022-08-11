const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc Show add page
// @route GET /stories/add
router.get('/add', ensureAuth, (req, res, next) => {
    res.render('stories/add');
});

// @desc Process add story form
// @route POST /stories
router.post('/', ensureAuth, async (req, res, next) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('stories/add');    
    }
});

// @desc Show all stories
// @route GET /stories
router.get('/', ensureAuth, async (req, res, next) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ creatdAt: 'desc' })
            .lean()
        res.render('stories/index', {stories})
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

// @desc Show edit page
// @route GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res, next) => {
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()
    if (!story) {
        return res.render('error/404')
    }
    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        res.render('stories/edit', {
            story
        })
    }   
});

// @desc Process edit story form
// @route POST /stories/:id
router.put('/:id', ensureAuth, async (req, res, next) => {
    let story = await Story.findOne({_id: req.params.id}).lean()
    if (!story) {
        return res.render('error/404')
    }
    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        story = await Story.findOneAndUpdate({_id: req.params.id}, req.body,{
            new: true,
            runValidators: true
        })
        res.redirect('/dashboard')
    }
});

// @desc Delete story form
// @route DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res, next) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')   
    }
});

// @desc View Story
// @route GET /stories/:id
router.get('/:id', ensureAuth, async (req, res, next) => {
    let story = await Story.findOne({_id: req.params.id})
        .populate('user')
        .lean()
    console.log(story)    
    if (!story) {
        return res.render('error/404')
    }
    if (story.status === 'private') {
        if (story.user._id != req.user.id ) {
            res.redirect('/stories')
        } else {
            res.render('stories/show', {
                story
            })
        }
    } else {
        res.render('stories/show', {
            story
        })
    }
});

// @desc Show user stories
// @route GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res, next) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()
        res.render('stories/index', {
            stories
        });
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
});

module.exports = router