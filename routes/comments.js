const express = require('express');
const { Blog, Comment } = require('../models');


const commentsRouter = express.Router();

commentsRouter.get('/', async (req, res, next) => {
    try {
        const comment = await Comment.find();
        res.send(comment);
    } catch (error) {
        return next(error);
    }
});

commentsRouter.post('/', async (req, res, next) => {
    try {
        const comment = await Comment.create(req.body);
        if (!comment) throw new Error('Failed');
        res.send({ create: "success" });
    } catch (error) {
        return next(error);
    }
});

commentsRouter.patch('/:comment_id', async (req, res, next) => {
    const { comment_id } = req.params;
    try {
        const comment = await Blog.updateOne({ "_id": comment_id },
            { "$set": req.body });
        if (!comment) throw new Error('notfound');
        res.send({ update: "success" });
    } catch (error) {
        return next(error);
    }
})

commentsRouter.delete('/:comment_id', async (req, res, next) => {
    const { comment_id } = req.params;
    try {
        const comment = await Blog.findByIdAndRemove(comment_id);
        if (!comment) throw new Error('notfound');
        res.send({ delete: "success" });
    } catch (error) {
        return next(error);
    }
})

module.exports = commentsRouter;