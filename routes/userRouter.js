const express = require('express');
const userRouter = express.Router();

const blogsRouter = require('./blogsRouter');
const { User, Blog } = require('../models');

userRouter.get('/:user_id', async (req, res) => {
    res.header({
        'Content-Type': 'application/json'
    });
    const populatedUser = await req.user.populate('blogs');
    res.status(201)
        .send(populatedUser);
});

userRouter.post('/', async (req, res, next) => {
    const { name, email } = req.body;
    try {
        await User.create({ name, email });
    } catch (err) {
        next(err);
    }
    res.status(204);
    res.send();
});

//Edit user by ID
userRouter.patch("/:user_id", async (req, res, next) => {
    const { user_id } = req.params;
    const { name, email } = req.body;
    try {
        await User.findByIdAndUpdate(user_id, {
            $set: { name, email },
        });
        res.send({ success: true });
    } catch (error) {
        return next(error);
    }
});

//Delete user by ID
userRouter.delete("/:user_id", async (req, res, next) => {
    const { user_id } = req.params;
    try {
        await User.findByIdAndDelete(user_id);
        res.send({ success: true });
    } catch (error) {
        next(error);
    }
});

userRouter.get('/:user_id/articles', async (req, res, next) => {
    const { user_id } = req.params;
    res.header({
        'Content-Type': 'application/json'
    });
    try {
        const userAtricles = await Blog.find({ "user": user_id });
        res.send(userAtricles);
    } catch (error) {
        return next(error);
    }
});

userRouter.post("/:user_id/suspend", async (req, res, next) => {
    const { comment_id } = req.params;
    try {
        const isSuspended = User.updateOne({ "_id": comment_id },
            { "$set": { "isSuspended": true } });
        if (!isSuspended) throw new Error('notfound');
        res.send({ suspended: "success" });
    } catch (error) {
        return next(error);
    }
})

userRouter.post("/:user_id/unsuspend", async (req, res, next) => {
    const { comment_id } = req.params;
    try {
        const unsuspend = User.updateOne({ "_id": comment_id },
            { "$set": { "isSuspended": false } });
        if (!unsuspend) throw new Error('notfound');
        res.send({ unsuspended: "success" });
    } catch (error) {
        return next(error);
    }
})

userRouter.param('user_id', async (req, res, next, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error('notfound');
        req.user = user;
    } catch (err) {
        return next(err);
    }
    next();
});

userRouter.use('/:user_id/blogs', blogsRouter);

module.exports = userRouter;